var reflection = {};
var xml={};

/**
 * Description: The script encapsulates any reflection related utility functions
 */
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
    };

    var getDiff=function(a,b,diff){

    };

    /**
     * The function calculates the differences between two simple JSON objects
     * @param a  The object with which b is compared
     * @param b  The target of the comparison
     * @return An object which records the differences between the two objects
     */
    reflection.diff=function(a,b){

    };



}());