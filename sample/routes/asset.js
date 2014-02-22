var log = new Log();

var getTopAssets = function (req, res, session) {
    var topAssets = [];
    var type = req._params.type;
    topAssets.push({id: 1, name: type + '-1'});
    topAssets.push({id: 2, name: type + '-2'});

    res._render(topAssets);
};

var getAsset = function (req, res, session) {
    var data={
        id: req._params.id,
        name: 'test-' + req._params.type
    };
    //print('Overriden');
    res._render(data);
};

var getAssetSample = function (req, res, session) {
   var data={
       msg:'This is a sample!'
   };

   res._render(data);
};

var putAsset = function (req,res) {
    var data={
        code:200,
        msg:'Asset updated successfully'
    };
    res._render(data);
};

var deleteAsset = function (req,res) {
    var data={
        code:200,
        msg:'Asset deleted successfully'
    };

    res._render(data);
};

var postAsset = function (req,res) {
    log.info(req._body);
    var data={
        id:1,
        name:'new '+req._params.type
    };

    res._render(data);
};