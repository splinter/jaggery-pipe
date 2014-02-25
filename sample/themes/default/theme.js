var cache=false;

var pipeEngine= require('/themes/default/pipe-caramel-engine.js').engine;

pipeEngine.use(require('./plugins/compile-resources.js'));
pipeEngine.use(require('./plugins/compiled-output-plugin.js'));

var engine=caramel.engine('pipe',pipeEngine);//require('/themes/default/pipe-caramel-engine.js').engine);

var resolve= function (path) {
    var log=new Log();
    log.info('Path: '+this.__proto__.resolve.call(this, path));
    return this.__proto__.resolve.call(this, path);
};


