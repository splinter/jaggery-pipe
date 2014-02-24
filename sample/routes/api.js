var getTopApis=function(req,res,session){
   var data={
       "1":"test-api-1",
       "2":"text-api-2"
   };

    res._render('topApis',data);
};

var getApi=function(req,res){
   var data={
       id:req._params.id,
       name:'This is a test api'
   };
    res._render('getApi',data);
};

var getApiOffers=function(req,res){
    var offers=[];
    offers.push({id:'1', 'msg':'Buy one and get two free!'});
    res._render('apiOffers',offers);
}

var putApi=function(req,res){
    var data={
        code:200,
        msg:'Api Updated successfully'
    };
    res._render(data);
};

var deleteApi=function(req,res){
    var data={
        code:200,
        msg:'Api deleted successfully!'
    };
    res._render(data);
};

var postApi=function(req,res){
    var data={
        code:200,
        msg:'Created api'
    };
    res._render(data);
};