var logger=function(Fiber,options){
    var log=new Log('logger');

    Fiber.events.on('*','*',function(context){
            log.info('Target: '+context.target+' action: '+context.action);
    });
};