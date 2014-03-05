var getTopApis=function(req,res,session){
   var data={
       "1":"test-api-1",
       "2":"text-api-2"
   };

    res.render('topApis',data);
};

var getApi=function(req,res){
   var data={
       id:req.params.id,
       name:'This is a test api'
   };
    res.render('getApi',data);
};

var getApiOffers=function(req,res){
    var offers=[];
    offers.push({id:'1', 'msg':'Buy one and get two free!'});
    res.render('apiOffers',offers);
}

var putApi=function(req,res){
    var data={
        code:200,
        msg:'Api Updated successfully'
    };
    res.render(data);
};

var deleteApi=function(req,res){
    var data={
        code:200,
        msg:'Api deleted successfully!'
    };
    res.render(data);
};

var postApi=function(req,res){
    var data={
        code:200,
        msg:'Created api'
    };
    res.render(data);
};