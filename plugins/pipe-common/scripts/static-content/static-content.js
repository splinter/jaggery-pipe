
var staticContent = (function () {

    var publicDirectory = '';
    var defaultContentType='text/html';
    var app = {};

    app.setDir = function (dir) {
        publicDirectory = dir;
    };

    app.serve = function (req, res) {

        var log = new Log();

        var startIndex = req.getRequestURI().indexOf(publicDirectory);
        var fileToReturn = req.getRequestURI().substring(startIndex);
        var file = new File(fileToReturn);


        if (!file.isExists()) {
            log.info('Could not locate the file!');
            return false;
        }


        try {
            file.open('r');
            print(file.getStream());
        }
        catch (e) {
            log.info('Unable to serve the file');
        }
        finally {
            file.close();
        }

        return true;
    };

    var handle = function (req, res, session, handlers) {
        var isServed = app.serve(req, res);

        //Throw an error if the resource could not be found
        if (!isServed) {
            handlers({code: 404, msg: 'Could not locate the resource'});
        }
    };

    return{
        handle:handle,
        app:app
    }


}());