var render=function(theme,data){
    var log=new Log();
    log.info('getAPi called');

    theme('index',{
       body:[
           {
               partial:'getApi',
               context:data
           }]
    });
};