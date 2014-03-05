var entity=require('entity');


var Gadget=new entity.Schema('Gadget',{
    name:String,
    id:String,
    type:String,
    description:String
});


Gadget.methods.install=function(){
    var log=new Log();
    log.info('Installing gadget');
};

Gadget.plugin(require('/extensions/entity-plugins/entity-logger.js').entityPlugin);
Gadget.plugin(require('/extensions/entity-plugins/asset-persistance-plugin.js').assetPersistancePlugin);