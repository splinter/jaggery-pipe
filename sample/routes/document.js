getDocument=function(req,res,session){
   var data={
       type:req.param.type,
       id:req.param.id
   };

   res.render('getDocument',data);
};