/**
 * Description: The Entity module implements a basic entity management framework
 */
var entity = {};

(function () {

    var entityManager = new EntityManager();
    var log = new Log('jaggery-entity');
    var utils = require('/modules/utils.js');

    function EntityManager() {
        this.schemas = {};
        this.generators = {};
    }

    /**
     * The function is used to register a schema with the entity manager
     */
    EntityManager.prototype.register = function (schema) {
        var schemaName = schema.meta.name;

        //Do nothing if the schema name has not been provided
        if (schemaName) {
            this.schemas[schemaName] = schema;
            this.generators[schemaName] = generator(schema);
        }
    };

    /**
     * The function returns an entity instance given the schema name of the entity
     * @param schemaName
     */
    EntityManager.prototype.entity = function (schemaName) {
        if (this.generators.hasOwnProperty(schemaName)) {
            var generator = this.generators[schemaName];
            var schema = this.schemas[schemaName];

            //Attach the static methods
            attachStaticMethods(generator, schema);

            //TODO:Cache this the first time so we don't loop
            return generator;
        }
        return null;
    };

    /**
     * The function adds static methods defined in the schema to the
     * generator function
     * @param generator
     * @param schema
     */
    var attachStaticMethods = function (generator, schema) {
        for (var index in schema.static) {
            generator[index] = schema.static[index];
        }
    };

    var DEFAULT_FIELD_TYPE = 'string';

    var DEFAULT_REQUIRED = false;
    var DEFAULT_STRING_VALUE = '';
    var DEFAULT_NUM_VALUE = 0;
    var DEFAULT_BOOL_VALUE = false;

    /**
     * The class is used to describe a field type
     */
    function FieldType(options) {
        this.type = DEFAULT_FIELD_TYPE;
        this.default = '';
        this.required = DEFAULT_REQUIRED;
        utils.reflection.copyProps(options, this);

        this.type = typeof this.type();
        //Assign default values based on the type
        this.default = this.default ? this.default : getDefaultValues(this.type);
    }

    /**
     * The function will assign the default value based on the type
     * @param fieldType
     * @param field
     */
    var getDefaultValues = function (fieldType) {
        var value;
        switch (fieldType) {
            case 'string':
                value = DEFAULT_STRING_VALUE;
                break;
            case 'number':
                value = DEFAULT_NUM_VALUE;
                break;
            case 'boolean':
                value = DEFAULT_BOOL_VALUE;
                break;
            default:
                value = DEFAULT_STRING_VALUE;
                break;
        }

        return value;
    };

    function EntitySchema(entityName, entityProps, entityMeta) {
        this.meta = entityMeta || {};
        this.props = entityProps || {};
        this.meta.name = entityName;
        this.meta.plugins = {};

        resolveTypes(entityProps);

        //Register the schema
        EntitySchema._em.register(this);

        this.methods = {};
        this.static = {};

        this.meta.plugins.save = {pre: [], post: []};
        this.meta.plugins.init = {pre: [], post: []};
        this.meta.plugins.validate = {pre: [], post: []};
        this.meta.plugins.remove = {pre: [], post: []};
    }

    /**
     * The function resolves the types of each of the
     * properties
     * @param props
     */
    var resolveTypes = function (props) {

        var fieldType;

        for (var key in props) {

            //If it is a function it is one of the in built types
            if (typeof props[key] == 'function') {
                //We need to create an instance of the FieldType
                fieldType = new FieldType({type: props[key]});
            }
            else {
                //The user has provided an object, fill in any missing values
                fieldType = new FieldType(props[key]);
            }

            props[key] = fieldType;
        }
    };

    EntitySchema.prototype.pre = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].pre.push(handler);
    };

    EntitySchema.prototype.post = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].post.push(handler);
    };

    EntitySchema.prototype.save = function (entity) {
        var entity = entity.toJSON();
        var preSave = this.meta.plugins.save.pre;
        var postSave = this.meta.plugins.save.post;

        executePluginList(entity, preSave);
        log.info('Entity saved');
        executePluginList(entity, postSave);
    };

    EntitySchema.prototype.init = function (entity) {
        var entity = entity.toJSON();
        var pre = this.meta.plugins.init.pre;
        var post = this.meta.plugins.init.post;

        executePluginList(entity, pre);
        log.info('Entity initialized');
        executePluginList(entity, post);
    };

    EntitySchema.prototype.validate = function () {

    };

    EntitySchema.prototype.remove = function () {
        var entity = entity.toJSON();
        var pre = this.meta.plugins.remove.pre;
        var post = this.meta.plugins.remove.post;

        executePluginList(entity, pre);
        log.info('Entity removed!');
        executePluginList(entity, post);
    };

    /**
     * The function creates properties in an entity instance
     * @param entity
     */
    EntitySchema.prototype.fillProps = function (entity) {
        for (var key in this.props) {
            entity[key] = this.props[key].default;
        }
    }

    /**
     * The function allows a plugin to install itself for the schema
     * @param plugin  The plug-in to be installed to the schema
     */
    EntitySchema.prototype.plug = function (plugin) {
        plugin(this);
    };


    var initPlugins = function (action, plugins) {
        if (!plugins.hasOwnProperty(action)) {
            plugins[action] = {};
            plugins[action].pre = [];
            plugins[action].post = [];
        }
    };

    /**
     * The function executes each plugin in an array of plug-ins while
     * giving plug-in the option to continue to the next or stop processing
     * @param plugins
     */
    var executePluginList = function (entity, plugins) {
        if (plugins.length == 0) {
            return;
        }
        var index = -1;

        var next = function (entity, index) {
            if (plugins.length < index) {
                return;
            }
            else {
                index++;
                return plugins[index](entity, next);
            }
        };

        next(entity, index);
    };

    /**
     * The generator method takes a schema and then prepares a class which can be instanitaed by the user
     * @param schema The schema on which the class should be created
     * @returns An object which can be used to describe assets
     */
    var generator = function (schema) {

        var ptr = function (options) {

            //Add the properties that should be present based on the schema
            schema.fillProps(this);

            utils.reflection.copyProps(options, this);

            //Bind the methods to the object
            for (var index in schema.methods) {
                this[index] = schema.methods[index];
            }

            this.init();
        };

        ptr.prototype.getSchema = function () {
            return schema;
        };

        ptr.prototype.save = saveHandler;
        ptr.prototype.remove = removeHandler;
        ptr.prototype.validate = validateHandler;
        ptr.prototype.init = initHandler;
        ptr.prototype.toJSON = toJSON;

        return ptr;
    };


    var initHandler = function () {
        this.getSchema().init(this);
    };
    /**
     * The toJSON method
     * @returns {{}}
     */
    var toJSON = function () {
        var data = {};
        utils.reflection.copyProps(data, this);
        return data;
    };

    var saveHandler = function () {
        this.getSchema().save(this);
    };

    var removeHandler = function () {
        this.getSchema().remove(this);
    };

    var validateHandler = function () {
        this.getSchema().validate(this);
    };


    /**
     * A utility method to return an Entity
     * @param schemaName
     * @returns {*}
     */
    var getEntity = function (schemaName) {
        return entityManager.entity(schemaName);
    };

    EntitySchema._em = entityManager;


    entity.EntitySchema = EntitySchema;
    entity.EntityManager = entityManager;
    entity.Entity = getEntity;

}());