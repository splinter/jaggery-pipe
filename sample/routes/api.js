var getTopApis=function(req,res,session){
   return{
       "1":"test-api-1",
       "2":"text-api-2"
   }
};

var getApi=function(req){
   return{
       id:req._params.id,
       name:'This is a test api'
   }
};

var getApiOffers=function(req){
    var offers=[];
    offers.push({id:'1', 'msg':'Buy one and get two free!'});
    return offers;
}

var putApi=function(){
    return{
        code:200,
        msg:'Api Updated successfully'
    }
};

var deleteApi=function(){
    return{
        code:200,
        msg:'Api deleted successfully!'
    }
};

var postApi=function(){
    return{
        code:200,
        msg:'Created api'
    }
};