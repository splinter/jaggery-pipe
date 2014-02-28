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
            return this.generators[schemaName];
        }
        return null;
    };


    function EntitySchema(entityName, entityProps, entityMeta) {
        this.meta = entityMeta || {};
        this.props = entityProps || {};
        this.meta.name = entityName;

        //Register the schema
        EntitySchema._em.register(this);

        this.methods = {};
        this.static = {};
    }

    EntitySchema.prototype.pre=function(action,handler){

    };

    EntitySchema.prototype.post=function(){

    };

    EntitySchema.prototype.save=function(){

    };

    var executePluginList=function(plugins){

    };

    /**
     * The generator method takes a schema and then prepares a class which can be instanitaed by the user
     * @param schema The schema on which the class should be created
     * @returns An object which can be used to describe assets
     */
    var generator = function (schema) {

        var ptr = function (options) {

            //Add the properties that should be present based on the schema
            utils.reflection.copyPropKeys(schema.props, this);

            utils.reflection.copyProps(options, this);

            //Bind the methods to the object
            for (var index in schema.methods) {
                this[index] = schema.methods[index];
            }

            this.init();
        };

        ptr.prototype.save = saveHandler;
        ptr.prototype.remove = removeHandler;
        ptr.prototype.validate = validateHandler;
        ptr.prototype.init=initHandler;

        return ptr;
    };

    var initHandler = function () {
        log.info('Init method called');
    };


    var saveHandler = function () {
        var props = utils.reflection.getProps(this);
        log.info(stringify(props));
    };

    var removeHandler = function () {

    };

    var validateHandler = function () {

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