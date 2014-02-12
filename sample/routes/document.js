getDocument=function(req,res,context){
    var type=context.arguments.type;
    var id=context.arguments.id;
    print('Getting document of '+type+' for id: '+id);
};