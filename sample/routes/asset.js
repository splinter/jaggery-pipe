var log = new Log();

var getTopAssets = function (req, res, session) {
    var topAssets = [];
    var type = req._params.type;
    topAssets.push({id: 1, name: type + '-1'});
    topAssets.push({id: 2, name: type + '-2'});

    return topAssets;
};

var getAsset = function (req, res, session) {
    return{
        id: req._params.id,
        name: 'test-' + req._params.type
    };
};

var getAssetSample = function (req, res, session) {
   return{
       msg:'This is a sample!'
   }
};

var putAsset = function () {
    return{
        code:200,
        msg:'Asset updated successfully'
    }
};

var deleteAsset = function () {
    return{
        code:200,
        msg:'Asset deleted successfully'
    }
};

var postAsset = function () {
    return{
        id:1,
        name:'new api'
    }
};