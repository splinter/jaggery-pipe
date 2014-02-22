/**
 * Description: The script implements a request body parser which will read any request content
 * and convert it to a JSON object which will be accessible as the req._body property
 * by other handlers
 * Filename:body-parser.js
 */
var bodyParser = (function () {

    var handle = function (req, res, session, handlers) {

        var content=req.getContent();
        var contentObj={};

        //Only parse if the user has provided any content
        if(content){
           contentObj=parse(content);
        }

        req._body=contentObj;

        handlers();
    };

    return{
        handle: handle
    }
}());