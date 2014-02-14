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
    };

    var globals = function () {
        log.info('Globals method called');
       printArgs(arguments)
    };

    var render = function () {
        log.info('Render method called');
       printArgs(arguments);
    };

    var theme=function(page,contexts,jss,css,code){

    };

    var printArgs = function (args) {
        log.info('Parameter count: ' + args.length);
        for (var key in args) {
            log.info('key: ' + stringify(args[key]));
        }
    };

    return{
        partials: partials,
        translate: translate,
        globals: globals,
        init: init,
        render: render
    }

}());