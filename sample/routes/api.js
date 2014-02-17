var getTopApis=function(req,res,session){
  var tenantId=session.get('tenantId');
  print('Getting the top apis of '+tenantId);
};

var getApi=function(req){
  print('Getting api details '+req._params.id);
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