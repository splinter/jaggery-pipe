/**
 * Description: The plug-in performs persistence operations to the registry
 */
var assetPersistancePlugin = function (schema, options) {
    var log = new Log();

    schema.to('save', function (entity) {
        log.info('Saving the ' + schema.meta.name + ' to the registry.');
    });

    schema.to('remove', function (entity) {
        log.info('Removing the ' + schema.meta.name + ' from the registry.');
    });

};