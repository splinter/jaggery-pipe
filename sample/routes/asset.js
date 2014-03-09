var log = new Log();

var getTopAssets = function (req, res, session) {
    var topAssets = [];
    var type = req.params.type;
    topAssets.push({id: 1, name: type + '-1'});
    topAssets.push({id: 2, name: type + '-2'});

    res.render('topAssets',topAssets);
};

var getAsset = function (req, res, session) {
    var data={
        id: req.params.id,
        name: 'test-' + req.params.type
    };
    //print('Overriden');
    res.render('getAsset',data);
};

var getAssetSample = function (req, res, session) {
   var data={
       msg:'This is a sample!'
   };

   res.render('getAssetSample',data);
};

var putAsset = function (req,res) {
    var data={
        code:200,
        msg:'Asset updated successfully'
    };
    res.render(data);
};

var deleteAsset = function (req,res) {
    var data={
        code:200,
        msg:'Asset deleted successfully'
    };

    res.render(data);
};

var postAsset = function (req,res) {
    log.info(req.body);
    var data={
        id:1,
        name:'new '+req.params.type
    };

    res.render(data);
};