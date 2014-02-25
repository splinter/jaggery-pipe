/**
 * Description: The script contains a set of commonly used helpers inherited from the Caramel Handlebars engine.
 * Filename: default-helpers.js
 */
var helpers = function (Handlebars) {

    var renderData = function (data) {
        var template,
            context = typeof data.context === 'function' ? data.context() : data.context;
        if (data.partial) {
            if (log.isDebugEnabled()) {
                log.debug('Rendering template ' + data.partial);
            }

            template = Handlebars.compile(Handlebars.partials[data.partial]);
        } else {
            if (log.isDebugEnabled()) {
                log.debug('No template, serializing data');
            }
            template = serialize;
        }
        return template(context);
    };

    var meta = function (theme) {
        var code, g,
            meta = caramel.meta(),
            config = caramel.configs();
        code = 'var caramel = caramel || {}; caramel.context = "' + config.context + '"; caramel.themer = "' + theme.name + '";';
        code += "caramel.url = function (path) { return this.context + (path.charAt(0) !== '/' ? '/' : '') + path; };";
        g = theme.engine.globals(meta.data, meta);
        code += g || '';
        return renderJS(code, true);
    };

    var serialize = function (o) {
        var type = typeof o;
        switch (type) {
            case 'string':
            case 'number':
                return o;
            default :
                return stringify(o);
        }
    };


    var include = function (contexts) {
        var i, type,
            length = contexts ? contexts.length : 0,
            html = '';
        if (log.isDebugEnabled()) {
            log.debug('Including : ' + stringify(contexts));
        }
        if (length == 0) {
            return html;
        }
        type = typeof contexts;
        if (contexts instanceof Array) {
            for (i = 0; i < length; i++) {
                html += renderData(contexts[i]);
            }
        } else if (contexts instanceof String || type === 'string' ||
            contexts instanceof Number || type === 'number' ||
            contexts instanceof Boolean || type === 'boolean') {
            html = contexts.toString();
        } else {
            html = renderData(contexts);
        }
        return new Handlebars.SafeString(html);
    };

    var itr = function (obj, options) {
        var key, buffer = '';
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                buffer += options.fn({key: key, value: obj[key]});
            }
        }
        return buffer;
    };

    var func = function (context, block) {
        var param,
            args = [],
            params = block.hash;
        for (param in params) {
            if (params.hasOwnProperty(param)) {
                args.push(params[param]);
            }
        }
        return block(context.apply(null, args));
    };

    var js = function () {
        var i, url, length,
            html = '',
            theme = caramel.theme(),
            js = caramel.meta().js;
        if (!js) {
            return html;
        }
        length = js.length;
        html += meta(theme);
        if (length == 0) {
            return new Handlebars.SafeString(html);
        }
        url = theme.url;
        for (i = 0; i < length; i++) {
            //remove \n when production = true
            html += '\n' + renderJS(url.call(theme, 'js/' + js[i]));
        }
        return new Handlebars.SafeString(html);
    };

    var css = function () {
        var i, url, length,
            html = '',
            theme = caramel.theme(),
            css = caramel.meta().css;
        if (!css) {
            return html;
        }
        length = css.length;
        if (length == 0) {
            return new Handlebars.SafeString(html);
        }
        url = theme.url;
        for (i = 0; i < length; i++) {
            html += renderCSS(url.call(theme, 'css/' + css[i]));
        }
        return new Handlebars.SafeString(html);
    };

    var code = function () {
        var i, length,
            html = '',
            theme = caramel.theme(),
            meta = caramel.meta(),
            codes = meta.code;
        if (!codes) {
            return html;
        }
        length = codes.length;
        if (length == 0) {
            return html;
        }
        for (i = 0; i < length; i++) {
            html += evalCode(codes[i], meta.data, theme);
        }
        return new Handlebars.SafeString(html);
    };

    var url = function (path) {
        if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0) {
            return path;
        }
        return caramel.url(path);
    };

    var themeUrl = function (path) {
        if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0) {
            return path;
        }
        return caramel.themeUrl(path);
    };

    var t = function (text) {
        return translate(text) || text;
    };

    var json = function (obj) {
        return obj ? new Handlebars.SafeString(stringify(obj)) : null;
    };

    var cap = function (str) {
        return str.replace(/[^\s]+/g, function (str) {
            return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
        });
    };

    var slice = function (context, block) {
        var html = "",
            length = context.length,
            start = parseInt(block.hash.start) || 0,
            end = parseInt(block.hash.end) || length,
            count = parseInt(block.hash.count) || length,
            size = parseInt(block.hash.size) || length,
            i = start,
            c = 0;
        while (i < end && c++ < count) {
            html += block(context.slice(i, (i += size)));
        }
        return html;
    };


    return{
        js: js,
        include: include,
        itr: itr,
        func: func,
        js: js,
        css: css,
        code: code,
        url: url,
        themeUrl: themeUrl,
        t: t,
        json: json,
        cap: cap,
        slice: slice
    }

};