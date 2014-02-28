var reflection = {};


(function () {

    var log = new Log('utils-reflection');

    reflection.copyPropKeys = function (from, to) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = '';
            }
        }

        return to;
    };

    reflection.copyProps = function (from, to) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        }

        return to;
    };

    reflection.getProps = function (obj) {
        var props={};

        for(var key in obj){
            if(!(obj[key] instanceof  Function)){
                props[key]=obj[key];
            }
        }

        return props;
    };


    reflection.printProps = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                log.info('key: ' + key);
            }
        }
    }


}());