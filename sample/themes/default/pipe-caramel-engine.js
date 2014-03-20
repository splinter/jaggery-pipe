/**
 * Description: The following script implements a custom caramel engine. The impetus behind this engine is to support the
 * new routing mechanism.In fact,you should have found this engine inside the router module (If not something has gone
 * horribly wrong or ....right :) ).
 *
 * Dependencies:
 * ------------
 * The engine uses the Handlebars templating framework to render HTML , so make sure that the handlebars module is in the
 * modules directory
 *
 * In order for this engine to work you will need to be first configured as the default enegine in theme.js and when calling the
 * caramel render method,make sure to pass in a __viewId property (two underscores).
 *
 * The engine consumes a bunch of resources organized into several folders;
 * 1. partials
 * 2. pages
 * 3. public: All of the css,js and images should go here
 * 4. renderers
 * 5. handle-bar-helpers : Put all of your handlebars helpers here
 *
 *
 * Filename: pipe-caramel-engine.js
 */
var engine = (function () {

    var log = new Log('pipe-caramel-engine');
    var Handlebars = require('handlebars').Handlebars;
    var PARTIAL_DIR = 'partials';
    var PAGES_DIR = 'pages';
    var HELPER_DIR = 'handle-bar-helpers';
    var RENDERERS_DIR = 'renderers';
    var JS_DIR = 'public/js';
    var CSS_DIR = 'public/css';
    var IMAGES_DIR = 'public/images';
    var PUBLIC_DIR = 'public/';
    var TRANSLATION_FILE='/shared/i18n';
    var plugins = [];

    /**
     * The function is called when the engine is initialized by the Caramel core
     */
    var init = function () {
        this.partials(Handlebars);
    };

    var partials = function () {
        loadHandlebarsHelpers(HELPER_DIR, Handlebars);
        loadHandlebarsPartials(PARTIAL_DIR, Handlebars);
    };

    /**
     * The function checks whether default plug-ins have been registered if not
     * a set of default plugins are added.
     */
    var loadDefaultPlugins=function(){
        if(plugins.length==0){

        }
    };

    /**
     * The following function will check if a translation file is available for the provided
     * language in the i18n folder.If a translation is found it used to perform the translation,else
     * the core translate method is invoked.
     * @returns Translated text if  a matching language file is found on the server,else the same text
     */
    var translate = function () {
        var language, dir, path,
            config = caramel.configs(),
            code = config.language ? config.language() : 'en';
        language = languages[code];
        if (!language) {
            dir = TRANSLATION_FILE;
            path = caramel.theme().resolve(dir + '/' + code + '.json');
            if (!new File(path).isExists()) {
                return text;
            }
            language = (languages[code] = require(path));
            if (log.isDebugEnabled()) {
                log.debug('Language json loaded : ' + path);
            }
        }
        return language[text] || caramel.translate(text);
    };

    var globals = function () {
        log.info('Globals method called');
    };

    var getPublicDir = function () {
        return PUBLIC_DIR;
    }

    /**
     * The function returns the name of the provided file without the extension
     * @param file A file instance
     */
    var getFileName = function (file) {
        var fullName = file.getName();
        var components = fullName.split('.');
        var fileName = '';
        for (var index = 0; index < components.length - 1; index++) {
            fileName += components[index];
        }
        return fileName;
    };

    /**
     * The function returns the path of a directory relative to the themes folder
     * @param dir
     * @returns {*}
     */
    var getPath = function (dir) {
        var path = caramel.theme().resolve(dir);
        log.info('Path: ' + path);
        return path;
    };

    /**
     * The function is a helper to recursively travel a directory
     * @param file The current file been examined
     * @param register A function call back that will recieve the current file.It is free to do
     * what ever it wants with the file.
     */
    var recursiveRegister = function (file, register) {
        if (!file.isDirectory()) {
            register(file);
        }
        else {
            var dir = file;
            var files = dir.listFiles();

            for (var index in files) {
                recursiveRegister(files[index], register);
            }
            return;
        }
    };

    /**
     * The function registers all helpers in the provided directory
     * @param dir The name of the directory containing the helper functions
     */
    var loadHandlebarsHelpers = function (dir, handleBars) {
        var base = getPath(dir);//'/themes/default/' + dir;
        var dir = new File(base);
        log.info('Registering helpers');
        handleBars._getPublicDir = getPublicDir;
        handleBars._translate = translate;
        recursiveRegister(dir, function (file) {

            var helper = base + '/' + file.getName();
            var module = require(helper).helpers(handleBars);
            for (var key in module) {
                log.info('Registering helper: ' + key);
                handleBars.registerHelper(key, module[key]);
            }
        });
    };

    /**
     * The function is used to load all of the partials
     * @param dir The path to the directory containing the partials
     */
    var loadHandlebarsPartials = function (dir, handleBars) {
        var base = getPath(dir);//'/themes/default/' + dir;
        var dir = new File(base);
        recursiveRegister(dir, function (file) {
            file.open('r');
            log.info('Registering partial file: ' + file.getName());
            handleBars.registerPartial(getFileName(file), file.readAll());
            file.close();
        });
    };

    /**
     * This is the entry point for all the rendering.The caramel engine will call this
     * method internally.
     * @param data The data to be rendered along with a unique viewId which matches one of the renderers
     * @param meta A variable populated by the caramel engine , contains a bunch of usefull references to
     *             the request object (Refer: caramel.core.js)
     */
    var render = function (data, meta) {
        log.info('Render method called');
        var req = meta.request;
        var dir = getPath(RENDERERS_DIR);//'/themes/default/renderers';
        var viewId = data.__viewId || '';

        //There is no viewId
        if (viewId == '') {
            //Render an error page
            print('Error ! Error ! No viewId has been specified');
            return;
        }
        var path = dir + '/' + viewId + '.js';
        var file = new File(path);

        if (file.isExists()) {
            var renderer = require(path);

            //Check if a render method exists
            if (renderer['render']) {
                renderer.render(theme, data);
                return;
            }

        }
        else {
            log.info('Rendering as json since the renderer could not be found or a render method was not specified.');
            print(caramel.build(data));
        }

    };

    /**
     * The function is used to obtain the page path given the name
     * @param pageName
     */
    var getPagePath = function (pageName) {
        var pagePath = PAGES_DIR + pageName + '.hbs';
        return   getPath(pagePath);
    };

    /**
     * The function returns the contents of a given page
     * @param pagePath
     * @returns {string}
     */
    var getPageContent = function (pagePath) {
        var page = new File(pagePath);
        var pageContent = '';

        if (page.isExists()) {
            page.open('r');
            pageContent = page.readAll();
            page.close();
        }
        return pageContent;
    };

    /**
     * The function is responsible for rendering the content seen by the user
     * @param page
     * @param contexts
     * @param jss
     * @param css
     * @param code
     */
    var theme = function (page, contexts, jss, css, code) {
        //var pagePath = getPagePath(page);
        //var pageContent=getPageContent(pagePath);
        var meta = caramel.meta();

        //var compiledPage = Handlebars.compile(pageContent);
        //print(compiledPage(contexts));
        var params = {
            page: page,
            contexts: contexts,
            Handlebars: Handlebars
        }

        //Call the process method of all plugins
        executePluginAction(plugins, 'process', params);

        //Call the output method so that an appropriate plug-in will do the rendering
        executePluginAction(plugins, 'output', params, true);
    };

    /**
     * The function executes the request plugin action on all of the
     * registered plugins
     * @param plugins
     * @param action
     */
    var executePluginAction = function (plugins, action, params, check) {

        var plugin;
        var page = params.page;
        var Handlebars = params.Handlebars;
        var contexts = params.contexts;
        var meta = caramel.meta();
        var check = check || false; //Call the check method of the plug-in before invoking action


        for (var index in plugins) {

            plugin = plugins[index];

            var usePlugin = true; //We assume all plug-ins can be used

            //Check if the plugin can be run
            if (check) {
                usePlugin = (plugin.check) ? plugin.check(meta.request) : false;

            }

            //Call the action provided the action exists and the plugin can be used
            if ((usePlugin) && (plugin[action])) {
                plugin[action](page, contexts, meta, Handlebars);
            }
        }
    };

    /**
     * The function is used to install a plug-in to the engine
     * @param plugin The plugin to be installed
     */
    var use = function (plugin) {
        plugins.push(plugin);
    };

    return{
        partials: partials,
        translate: translate,
        globals: globals,
        init: init,
        render: render,
        use: use
    };

}());