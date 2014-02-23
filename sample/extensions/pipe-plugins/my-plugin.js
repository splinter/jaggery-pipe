var handle=function(req,res,session,handlers){
    var log=new Log();
    log.info('my pipe plugin, does nothing!');
    handlers();
};