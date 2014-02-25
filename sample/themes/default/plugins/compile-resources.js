/**
 * The function attempts to read any helper functions for registered partials
 * @param data
 * @param meta
 */
var process = function (page,contexts, meta,Handlebars) {
    var blocks;
    var block;
    var helper;
    var out;

    //Go through each property in the contexts object
    for (var area in contexts) {

        if (contexts.hasOwnProperty(area)) {
            blocks = contexts[area];

            //Check if only one block was specified
            if (blocks instanceof  Array) {

                //Go through each block
                for (var index = 0; index < blocks.length; index++) {
                    block = blocks[index].partial || '';
                    helper=getHelper();
                    out=helper.resources(page,meta);

                    meta.js=out.js||[];
                    meta.css=out.css||[];
                    //To do: Add support for code
                }
            }
        }
    }
};

var getHelper = function (partialName) {
    var PARTIAL_HELPERS_DIR = 'helpers/';
    var partialHelperPath = PARTIAL_HELPERS_DIR+partialName+'.js';
    partialHelperPath=caramel.theme().resolve(partialHelperPath);
    var partialHelperFile=new File(partialHelperPath);

    //Return an empty resource function if the helper file does not exist
    if(!partialHelperFile.isExists()){
        return{
            resources:emptyResource
        }
    }
    return require(partialHelperPath);
};

var emptyResource=function(){
    return {};
}