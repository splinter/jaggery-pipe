/**
 * Description: The script implements a request body parser which will read any request content
 * and convert it to a JSON object which will be accessible as the req._body property
 * by other handlers
 * Filename:body-parser.js
 */
 
function hasOwnProperty(obj, element) {
    return Object.prototype.hasOwnProperty.call(obj, element);
}

function decodes(encodedURI) {
    return decodeURIComponent(encodedURI);
};

var bodyParser = (function () {

    var handle = function (req, res, session, handlers) {

        var content = req.getContent();
        var contentObj = content;
        var contentType = request.getContentType()||'';

        //parse if the user has provided any application/json content
        if((content) && (contentType=='application/json')) {
           contentObj = parse(content);
        }

        //parse if the user has provided any application/x-www-form-urlencoded
        if((content) && (contentType=='application/x-www-form-urlencoded')) {
            if(content) {
                var decodedURI = decodes(querystring),
                                 compoArray = [],
                                 obj = {};

                decodedURI.split('&').forEach(function(comp) {

                    comp.split('=').some(function(element, index, array) {

                        if(hasOwnProperty(obj, element.toString())) {
                            compoArray.push(obj[element]);
                            compoArray.push(array[1]);

                            obj[element] = compoArray;
                        } else {
                            Object.defineProperty(obj, element, {
                                enumerable:true,
                                writable:true,
                                value:array[1]
                            });
                        }
                        return true;
                    });
                });
                contentObj = obj;
            }
        }

        req.body = contentObj;

        handlers();
    };

    return {
        handle: handle
    }

}());
