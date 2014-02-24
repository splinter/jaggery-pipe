var render = function (viewId, data) {
    var log = new Log();

    //Check if the user has provided both a view Id and data
    if (arguments.length <2) {
        log.info('A view id and data must both be provided');
        return;
    }

    var caramel = require('caramel');
    data.__viewId=viewId;
    caramel.render(data);
};