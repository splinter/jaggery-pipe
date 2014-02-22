var getTopApis=function(req,res,session){
   var data={
       "1":"test-api-1",
       "2":"text-api-2"
   };

    res._render(data);
};

var getApi=function(req){
   var data={
       id:req._params.id,
       name:'This is a test api'
   };
    res._render(data);
};

var getApiOffers=function(req){
    var offers=[];
    offers.push({id:'1', 'msg':'Buy one and get two free!'});
    res._render(offers);
}

var putApi=function(){
    var data={
        code:200,
        msg:'Api Updated successfully'
    };
    res._render(data);
};

var deleteApi=function(){
    var data={
        code:200,
        msg:'Api deleted successfully!'
    };
    res._render(data);
};

var postApi=function(){
    var data={
        code:200,
        msg:'Created api'
    };
    res._render(data);
};