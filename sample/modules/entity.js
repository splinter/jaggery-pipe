/**
 * Description: The Entity module implements a basic entity management framework
 */
var entity = {};

(function () {

    function EntityManager() {
        this.schemas = {};
        this.EntitySchema=EntitySchema;
        this.EntitySchema._register=this;
    }

    /**
     * The function is used to register a schema with the entity manager
     */
    EntityManager.prototype.register = function (schema) {
        var schemaName=schema.meta.name;

        //Do nothing if the schema name has not been provided
        if(!schemaName){
            this.schemas[schemaName]=schema;
        }
    };


    function EntitySchema(entityName, entityProps, entityMeta) {
        this.meta = entityMeta || {};
        this.props = entityProps || {};
        this.meta.name = entityName;

        this._register(this);
    }


    entity=EntityManager;

}());