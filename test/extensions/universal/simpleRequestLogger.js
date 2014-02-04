var name = 'defaultLogger';

var handle = function (req, res, session, handlers) {
    var log = new Log();
    log.info('Request: '+req.getRequestURI());
    handlers();
};