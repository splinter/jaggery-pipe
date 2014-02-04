var name='simpleErrorHandler';

var environment='dev';
var DEV='dev';
var PRODUCTION='production';

var handle=function(err,req,res,session,handlers){
    if(environment==DEV){
        res.sendError(err.code?err.code:500,err.msg?err.msg:'');
    }
    else{
        res.sendError(err.code?err.code:500,'Oops something has gone wrong');
    }
}