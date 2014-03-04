/**
 * Description: The Entity module implements a basic entity management framework
 */
var entity = {};

(function () {


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
        this.validations = [];    //A validation object
        utils.reflection.copyProps(options, this);

        this.type = typeof this.type();
        //Assign default values based on the type
        this.default = this.default ? this.default : getDefaultValues(this.type);

        resolveDefaultValidations(this);
    }

    FieldType.prototype.validation = function (validator, msg) {
        this.validations.push({msg: (msg || 'No error message defined'),
            validator: validator});
    };

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

        this.meta.plugins.save = {pre: [], post: [], to:[]};
        this.meta.plugins.init = {pre: [], post: [],to:[]};
        //this.meta.plugins.validate = {pre: [], post: []};
        this.meta.plugins.remove = {pre: [], post: [],to:[]};

        //Attach validations
        attachValidations(this);

        //Attach default static methods
        attachDefaultStaticMethods(this);
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

    var attachDefaultStaticMethods=function(schema){
       schema.static.find=function(){
            log.warn('Find method not implemeneted');
            return [];
       };

       schema.static.findAll=function(){
            log.warn('FindAll method not implemented');
       };
    };

    /**
     * The function adds the default validations for a given field type
     */
    var resolveDefaultValidations = function (fieldSchema) {
        if (fieldSchema.required) {
            log.info('Adding required field validator');
            fieldSchema.validations.push({msg: 'Required field', validator: requiredFieldValidator});
        }
    };

    var requiredFieldValidator = function (fieldSchema, fieldValue) {
        log.info('Checking required field');
        if ((!fieldValue) || (fieldValue == '')) {
            return false;
        }

        return true;
    };

    /**
     * The function is used to return a reference to a field
     * @param fieldName
     * @returns {*}
     */
    EntitySchema.prototype.field = function (fieldName) {
        for (var key in this.props) {
            if (key == fieldName) {
                return this.props[key];
            }
        }

        return null;
    };

    EntitySchema.prototype.pre = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].pre.push(handler);
    };

    EntitySchema.prototype.post = function (action, handler) {

        initPlugins(action, this.meta.plugins);

        this.meta.plugins[action].post.push(handler);
    };

    EntitySchema.prototype.to=function(action,handler){
        this.meta.plugins[action].to.push(handler);
    };

    /**
     * The function allows a plugin to define extra properties
     * @param options An object containing properties to be added to the schema
     */
    EntitySchema.prototype.add = function (options) {
        resolveTypes(options);

        //Add each property in the options object to the properties
        for (var key in options) {
            this.props[key] = options[key];
        }
    };

    EntitySchema.prototype.save = function (entity) {
        var entity = entity.toJSON();

        var preSave = this.meta.plugins.save.pre;
        var postSave = this.meta.plugins.save.post;
        var toSave=this.meta.plugins.save.to;
        var action='save';

        executePluginList('pre'+action,entity, preSave);
        executePluginList(action,entity,toSave);
        executePluginList('post'+action,entity, postSave);
    };

    /**
     * The function will invoke any initialization logic on the entity which invokes this method
     * @param entity  The entity which has invoked the init method
     */
    EntitySchema.prototype.init = function (entity) {
        var entity = entity.toJSON();
        var pre = this.meta.plugins.init.pre;
        var post = this.meta.plugins.init.post;
        var to=this.meta.plugins.init.to;
        var action='init';

        executePluginList('pre'+action,entity, pre);
        executePluginList(action,entity,to);
        executePluginList('post'+action,entity, post);
    };

    /**
     * The function attaches validations to occur before the save method is invoked
     * @param schema
     */
    var attachValidations = function (schema) {

        var errors = {};

        schema.pre('save', function (entity, next) {

            log.info('Performing validations');

            //Go through each field and invoke the validations
            for (var key in schema.props) {

                log.info('Validating ' + key + '= ' + entity[key]);

                var validations = schema.props[key].validations;

                //Execute all validators defined in the
                for (var index in validations) {

                    var isFailed = validations[index].validator(entity[key], schema.props[key]);

                    //Record the error
                    if (isFailed) {

                        if (!errors[key]) {
                            errors[key] = {};
                        }

                        errors[key].value = entity[key];
                        errors[key].message = validations[index].msg;
                    }
                }
            }
            next();
            log.info('Finished validating....');
            log.info(errors);
        });
    };

    /**
     * The function is called whenever the current entity needs to be removed.It will call any plugins
     * registered to remove the entity.
     */
    EntitySchema.prototype.remove = function (entity) {
        var entity = entity.toJSON();
        var pre = this.meta.plugins.remove.pre;
        var post = this.meta.plugins.remove.post;
        var to=this.meta.plugins.remove.to;
        var action='remove';

        executePluginList('pre'+action,entity, pre);
        executePluginList(action,entity,to);
        executePluginList('post'+action,entity, post);
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
    EntitySchema.prototype.plugin = function (plugin, options) {
        var options = options || {};
        plugin(this, options);
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
    var executePluginList = function (action,entity, plugins) {
        if (plugins.length == 0) {
            log.warn('No plugins defined for '+action);
            return;
        }

        var index = 0;

        var next = function () {
            var plugin=plugins[index];
            index++;

            if (plugins.length < index) {
                return;
            }
            else {
                return plugin(entity, next);
            }
        };

        next();
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
        utils.reflection.copyProps(this, data);
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

    var entityManager=new EntityManager();;
   /* if (!session.get('enManager')) {
        log.info('Caching Entity Manager');
        entityManager = new EntityManager();
        session.put('enManager', entityManager);
    }
    else {
        log.info('Using cached Entity Manager');
        entityManager = session.get('enManager');
    } */

    EntitySchema._em = entityManager;


    entity.EntitySchema = EntitySchema;
    entity.EntityManager = entityManager;
    entity.Entity = getEntity;

}());