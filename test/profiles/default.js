var init=function(pipe){
    var log=new Log();
    log.info('DEFAULT PROFILE');

    pipe.plug(require('/extensions/universal/simpleRequestLogger.js'));
};