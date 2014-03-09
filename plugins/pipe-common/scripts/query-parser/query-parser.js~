/**
 * Description: The script is used to populate the query parameters into
 * a JSON object that is accessible to other plug-ins through req._query
 * Filename: query-parser.js
 */
var queryParser = (function () {

    var handle = function (req, res, session, handlers) {

        var queryString = req.getQueryString();

        if (queryString) {

            //Split into pairs
            var pairs = queryString.split('&');
            var kv;
            var data = {};

            for (var index in pairs) {
                kv = pairs[index].split('=');
                data[kv[0]] = kv[1] || '';
            }

            req.query = data;

        }

        handlers();
    };

    return {
        handle: handle
    }
}());