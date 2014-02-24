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

    /**
     * The function registers all helpers in the provided directory
     * @param dir The name of the directory containing the helper functions
     */
    var loadHandlebarsHelpers=function(dir){

    };

    var render = function (data, meta) {
        log.info('Render method called');
        var RouteMap=require('router').RouteMap;
        var rm=new RouteMap();
        readMappingFile('',rm);

        var req=meta.request;
        var uri=req.getRequestURI();
        var route=rm.match(uri);

        var renderer=require(route.ref).render(theme);
    };

    var theme = function (page, contexts, jss, css, code) {
        var file, template, path, area, blocks, helper, length, i, o, areas, block,
            areaContexts, data, areaData, find, blockData,
            theme = caramel.theme(),
            meta = caramel.meta(),
            xcd = meta.request.getHeader(caramelData);
        js = js || [];
        css = css || [];
        code = code || [];

        if (xcd) {
            find = function (areaContexts, partial) {
                var i, context,
                    length = areaContexts.length;
                for (i = 0; i < length; i++) {
                    if (areaContexts[i].partial === partial) {
                        context = areaContexts[i].context;
                        return typeof context === 'function' ? context() : context;
                    }
                }
                return null;
            };
            data = {
                _: {}
            };
            areas = parse(xcd);
            for (area in areas) {
                if (areas.hasOwnProperty(area)) {
                    areaContexts = contexts[area];
                    if (areaContexts instanceof Array) {
                        blocks = areas[area];
                        areaData = (data[area] = {});
                        length = blocks.length;
                        for (i = 0; i < length; i++) {
                            block = blocks[i];
                            blockData = (areaData[block] = {
                                resources: {}
                            });
                            blockData.context = find(areaContexts, block);
                            path = theme.resolve.call(theme, helpersDir + '/' + block + '.js');
                            if (new File(path).isExists()) {
                                helper = require(path);
                                if (helper.resources) {
                                    o = helper.resources(page, meta);
                                    blockData.resources.js = o.js;
                                    blockData.resources.css = o.css;
                                    blockData.resources.code = o.code ? evalCode(o.code, meta.data, theme) : null;
                                }
                            }
                        }
                    } else {
                        data[area] = areaContexts;
                    }
                }
            }
            data._.js = js;
            data._.css = css;
            data._.code = code;
            meta.response.addHeader('Content-Type', 'application/json');
            print(data);
            return;
        }

        for (area in contexts) {
            if (contexts.hasOwnProperty(area)) {
                blocks = contexts[area];
                if (blocks instanceof Array) {
                    length = blocks.length;
                    for (i = 0; i < length; i++) {
                        path = caramel.theme().resolve(helpersDir + '/' + blocks[i].partial + '.js');
                        if (new File(path).isExists()) {
                            helper = require(path);
                            if (helper.resources) {
                                o = helper.resources(page, meta);
                                js = o.js ? js.concat(o.js) : js;
                                css = o.css ? css.concat(o.css) : css;
                                code = o.code ? code.concat(o.code) : code;
                            }
                        }
                    }
                }
            }
        }
        meta.js = js;
        meta.css = css;
        meta.code = code;
        path = caramel.theme().resolve(pagesDir + '/' + page + '.hbs');
        if (log.isDebugEnabled()) {
            log.debug('Rendering page : ' + path);
        }
        file = new File(path);
        file.open('r');
        template = Handlebars.compile(file.readAll());
        file.close();
        print(template(contexts));
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