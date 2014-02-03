var name = 'defaultLogger';

var handle = function (req, res, session, handlers) {
    var log = new Log();
    log.info('Request: '+req.getRequestURI());

    var uriMatcher=new URIMatcher('/{context}/assets/{type}');
    if(uriMatcher.match('/{context}/assets/api')){
        log.info('Same!');
    }
    else{
        log.info('Not same');
    }
    handlers();
};