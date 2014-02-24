
var render = function (data, req, res, session) {
    var log=new Log();
    log.info('Caramel Renderer called');

    var caramel = require('caramel');
    caramel.render(data);
};