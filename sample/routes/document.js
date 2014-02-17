getDocument=function(req,res,session){
    var type=req._params.type;
    var id=req._params.id;
    print('Getting document of '+type+' for id: '+id);
};