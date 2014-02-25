var check=function(req){
    //Check the request to see if the application/html content-type header has been set

    return true;
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

    if(page.isExists()){
        page.open('r');
        pageContent=page.readAll();
        page.close();
    }
    return pageContent;
};


/**
 * The function generates the contents of a page
 * @param page
 * @param contexts
 * @param meta
 * @param Handlebars
 */
var output=function(page,contexts,meta,Handlebars){
   var pagePath=getPagePath(page);
   var pageContent=getPageContent(pagePath);

   var compiledPage=Handlebars.compile(pageContent);
   print(compiledPage(contexts));
};