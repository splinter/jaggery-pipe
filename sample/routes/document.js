getDocument=function(req,res,session){
   return{
       type:req._param.type,
       id:req._param.id
   }
};