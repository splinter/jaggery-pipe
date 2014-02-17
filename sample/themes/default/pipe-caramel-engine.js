var engine = (function () {

    var log = new Log('pipe-caramel-engine');

    var init = function () {
        log.info('Init method called');
        printArgs(arguments);
    };

    var partials = function () {
        log.info('Partials method called');
        printArgs(arguments);
    };

    var translate = function () {
        log.info('Translate method called');
        printArgs(args);
        //We can reuse the code from the Caramel Handlebars engine
    };

    var globals = function () {
        log.info('Globals method called');
        printArgs(arguments)
    };

    var render = function (data, meta) {
        log.info('Render method called');
        var rm=require('/themes/default/route-map.js');

        readMappingFile('',rm.RouteMap);

        var req=meta.request;
        var uri=req.getRequestURI();
        var rendererPath=rm.RouteMap.match(uri);

        log.info('Renderer path: '+rendererPath);

        log.info(rm.RouteMap.map);

        //Determine the renderer which needs to be called
        //printArgs(arguments);
    };

    var theme = function (page, contexts, jss, css, code) {

    };

    var printArgs = function (args) {
        log.info('Parameter count: ' + args.length);
        for (var key in args) {
            log.info('key: ' + stringify(args[key]));
        }
    };

    var readMappingFile=function(fileName,routeMap){
        var mapping=require('/themes/default/mapping.json');

        for(var key in mapping){
            routeMap.add(key,mapping[key]);
        }

        log.info(mapping);
    };

    return{
        partials: partials,
        translate: translate,
        globals: globals,
        init: init,
        render: render
    };

}());