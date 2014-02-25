var render=function(theme,data){
    theme('index',{
       body:[
           {
               partial:'getApi',
               context:data
           }]
    });
};