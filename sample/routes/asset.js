var log = new Log();

var getTopAssets=function(req,res,session){
    var tenantId=session.get('tenantId');
    print('Top assets page for '+tenantId);
};

var getAsset=function(req,res,session){
    var assetId=req._params.id;
    print('Returning asset details for asset ID: '+assetId);
};

var putAsset=function(){
    print('Update asset details for any asset');
};

var deleteAsset=function(){
    print('Delete assets details for any asset');
};

var postAsset=function(){
    print('Creating a new asset');
};