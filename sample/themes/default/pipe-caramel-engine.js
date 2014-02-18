var engine = (function () {

    var log = new Log('pipe-caramel-engine');

    var init = function () {
        log.info('Init method called');
    };

    var partials = function () {
        log.info('Partials method called');
    };

    var translate = function () {
        log.info('Translate method called');
        //We can reuse the code from the Caramel Handlebars engine
    };

    var globals = function () {
        log.info('Globals method called');

    };

    var render = function (data, meta) {
        log.info('Render method called');
        var RouteMap=require('jaggery-router').RouteMap;
        var rm=new RouteMap();
        readMappingFile('',rm);

        var req=meta.request;
        var uri=req.getRequestURI();
        var route=rm.match(uri);

        var renderer=require(route.ref).render(theme);
    };

    var theme = function (page, contexts, jss, css, code) {

    };

    var readMappingFile=function(fileName,routeMap){
        var mapping=require('/themes/default/mapping.json');

        for(var key in mapping){
            routeMap.add(key,mapping[key]);
        }
    };

    return{
        partials: partials,
        translate: translate,
        globals: globals,
        init: init,
        render: render
    };

}());