var log = new Log();

var getTopAssets=function(req,res,context){
    var tenantId=context.session.get('tenantId');
    print('Top assets page for '+tenantId);
};

var getAsset=function(req,res,context){
    var assetId=context.arguments.id;
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