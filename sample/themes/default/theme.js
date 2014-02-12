var cache=false;

//var engine = require('caramel').engine('handlebars');

var engine = caramel.engine('handlebars', (function () {
    return {
        partials: function (Handlebars) {
            var theme = caramel.theme();
            var partials = function (file) {
                (function register(prefix, file) {
                    var i, length, name, files;
                    if (file.isDirectory()) {
                        files = file.listFiles();
                        length = files.length;
                        for (i = 0; i < length; i++) {
                            file = files[i];
                            register(prefix ? prefix + '.' + file.getName() : file.getName(), file);
                        }
                    } else {
                        name = file.getName();
                        if (name.substring(name.length - 4) !== '.hbs') {
                            return;
                        }
                        file.open('r');
                        Handlebars.registerPartial(prefix.substring(0, prefix.length - 4), file.readAll());
                        file.close();
                    }
                })('', file);
            };
            //TODO : we don't need to register all partials in the themes dir.
            //Rather register only not overridden partials
            partials(new File(theme.__proto__.resolve.call(theme, 'partials')));
            partials(new File(theme.resolve('partials')));

            Handlebars.registerHelper('dyn', function (options) {
                var asset = options.hash.asset,
                    resolve = function (path) {
                        var p,
                            store = require('/modules/store.js');
                        if (asset) {
                            p = store.ASSETS_EXT_PATH + asset + '/themes/' + theme.name + '/' + path;
                            if (new File(p).isExists()) {
                                return p;
                            }
                        }
                        return theme.__proto__.resolve.call(theme, path);
                    };
                partials(new File(resolve('partials')));
                return options.fn(this);
            });
        },
        render: function (data, meta) {
            var log=new Log();
            log.info('Entered the render method');
            if (request.getParameter('debug') == '1') {
                response.addHeader("Content-Type", "application/json");
                print(stringify(data));
            } else {
                this.__proto__.render.call(this, data, meta);
            }
        },
        globals: function (data, meta) {
            var store = require('/modules/store.js'),
                user = require('store').server.current(meta.session);
            return 'var store = ' + stringify({
                user: user ? user.username : null
            });
        }
    };
}()));


var resolve= function (path) {
    var fn, p;
    log.info('Resolving path');
    path = (path.charAt(0) !== '/' ? '/' : '') + path;
    p = this.base() + path;
    if (new File(p).isExists() || !(this.__proto__ instanceof Theme)) {
        if (log.isDebugEnabled()) {
            log.debug('Resolved path : ' + p);
        }
        return p;
    }
    fn = this.__proto__.base;
    p = fn ? fn.call(this.__proto__) + path : p;
    if (log.isDebugEnabled()) {
        log.debug('Inherited path : ' + p);
    }
    return p;
};
