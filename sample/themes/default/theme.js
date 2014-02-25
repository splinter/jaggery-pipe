var cache=false;


var engine=caramel.engine('pipe',require('/themes/default/pipe-caramel-engine.js').engine);

var resolve= function (path) {
    var log=new Log();
    log.info('Path: '+this.__proto__.resolve.call(this, path));
    return this.__proto__.resolve.call(this, path);
};


