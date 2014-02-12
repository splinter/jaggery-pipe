var getTopApis=function(req,res,context){
  var tenantId=context.session.get('tenantId');
  print('Getting the top apis of '+tenantId);
};

var getApi=function(){
  print('Getting api details');
};

var putApi=function(){
  print('Updating api details');
};

var deleteApi=function(){
  print('Deleting api details');
};

var postApi=function(){
  print('Creating api details');
};