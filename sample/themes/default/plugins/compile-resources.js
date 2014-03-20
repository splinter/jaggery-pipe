/**
 * The function attempts to read any helper functions for registered partials
 * @param data
 * @param meta
 */

var compileResources={};

(function () {

    var process = function (page, contexts, meta, Handlebars) {
        var blocks;
        var block;
        var helper;
        var out;

        var log = new Log();
        log.info('Compiling resources');

        //Go through each property in the contexts object
        for (var area in contexts) {
            log.info('Gathering resources for area: ' + area);

            if (contexts.hasOwnProperty(area)) {
                blocks = contexts[area];

                //Check if only one block was specified
                if (blocks instanceof  Array) {

                    //Go through each block
                    for (var index = 0; index < blocks.length; index++) {
                        log.info('Invoking helper for block: ' + blocks[index].partial);
                        block = blocks[index].partial || '';
                        helper = getHelper(blocks[index].partial);
                        out = helper.resources(page, meta);
                        log.info(stringify(out));
                        meta.js = out.js || [];
                        meta.css = out.css || [];
                        //To do: Add support for code
                    }
                }
            }
        }
    };

    var PARTIAL_HELPERS_DIR = 'helpers/partials/';

    var getHelper = function (partialName) {

        var partialHelperPath = PARTIAL_HELPERS_DIR + partialName + '.js';
        partialHelperPath = caramel.theme().resolve(partialHelperPath);
        var partialHelperFile = new File(partialHelperPath);

        //Return an empty resource function if the helper file does not exist
        if (!partialHelperFile.isExists()) {
            return{
                resources: emptyResource
            }
        }
        return require(partialHelperPath);
    };

    var emptyResource = function () {
        return {};
    };

    compileResources.process=process;

}());