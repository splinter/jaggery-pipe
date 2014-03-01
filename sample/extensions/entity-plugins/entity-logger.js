/**
 * Description: The plug-in is responsible for logging the contents of an asset at each event
 * of an asset
 * Filename:entity-logger.js
 */
var entityPlugin = function (Schema) {
    var log = new Log('entity-logger');

    log.info('entity-logger plugin registered');

    Schema.pre('save', function (entity) {
        log.info('Before been saved');
        log.info(stringify(entity));
    });

    Schema.sa

};