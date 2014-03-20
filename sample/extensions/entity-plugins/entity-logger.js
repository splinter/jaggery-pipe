/**
 * Description: The plug-in is responsible for logging the contents of an asset at each event
 * of an asset
 * Filename:entity-logger.js
 */
var entityPlugin = function (schema,options) {
    var log = new Log('entity-logger');

    log.info('entity-logger plugin registered with '+stringify(options));

    schema.add({
        logType:{type:String,default:'Simple Logger'}
    });

    schema.pre('save', function (entity) {
        log.info('Before been saved '+options.title);
        log.info(stringify(entity));
    });

    schema.post('save',function(entity){
       log.info('Entity saved successfully '+options.title);
    });

    schema.pre('init',function(entity){
        log.info('Initialize called '+schema.meta.name);
    });

};