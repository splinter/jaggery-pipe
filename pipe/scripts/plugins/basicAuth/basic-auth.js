var name = 'defaultBasicAuth';

var handle = function (req, res, session, handlers) {
    var log = new Log();
    log.info('Basic authentication handler called!');
    //handlers({code:403,msg:'Need to login'});
    res.addHeader('WWW-Authenticate','Basic realm="restricted"');
    res.sendError(401);
};