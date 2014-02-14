var render=function(data,viewId){
    var log=new Log();
    var caramel=require('caramel');
    print('View Id: '+viewId);
    caramel.render(data);

};