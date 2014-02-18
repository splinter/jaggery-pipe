var getTopApis=function(req,res,session){
  var tenantId=session.get('tenantId');
  //print('Getting the top apis of '+tenantId);
   return{
       "1":"test-api-1",
       "2":"text-api-2"
   }
};

var getApi=function(req){
  print('Getting api details '+req._params.id);
};

var getApiOffers=function(req){
   print('Getting api offers');
}

var putApi=function(){
  print('Updating api details');
};

var deleteApi=function(){
  print('Deleting api details');
};

var postApi=function(){
  print('Creating api details');
};