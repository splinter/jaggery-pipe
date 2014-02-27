var handle=function(req,res,session,handlers){
   var log=new Log();
   log.info('Serving some static content');
   log.info(req.getContentType());
};