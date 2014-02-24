getDocument=function(req,res,session){
   var data={
       type:req._param.type,
       id:req._param.id
   };

   res._render('getDocument',data);
};