var reflection = {};
var xml = {};
var file = {};
var datastructures={};
datastructures.array={};

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
        var props = {};

        for (var key in obj) {
            if (!(obj[key] instanceof  Function)) {
                props[key] = obj[key];
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

    var getDiff = function (a, b, diff) {

    };

    /**
     * The function calculates the differences between two simple JSON objects
     * @param a  The object with which b is compared
     * @param b  The target of the comparison
     * @return An object which records the differences between the two objects
     */
    reflection.diff = function (a, b) {

    };


}());


(function () {

    var log=new Log();

    /**
     * The function  checks whether a directory contains a particular file
     * @param dir   The directory in which the file must be checked
     * @param file  A File object if the file exists,else null
     */
    file.getFileInDir = function (dir, fileName) {
        var isFilePresent = false;
        var files = dir.listFiles();

        for (var index in files) {
            if (files[index].getName() == fileName) {
                log.info('File: '+fileName+' found.');
                return files[index];
            }
        }

        return null;
    };

    /**
     * The function returns the file extension of the file
     * @param file
     * @return: The extension of the file
     */
    file.getExtension=function(file){

    };

    /**
     * The function returns the name of the file without the file extension
     * @param file A file object
     * @return: The name of the file without the extension
     */
    file.getFileName=function(file){

    };

    /**
     * The function returns a list of all sub directories in a given directory
     * @param dir The root directory
     * @return: An array containing all sub directories
     */
    file.getAllSubDirs=function(dir){
       var files=dir.listFiles();
       var subDirs=[];

       for(var index in files){
           if(files[index].isDirectory()){
                subDirs.push(files[index]);
           }
       }

       return subDirs;
    };

}());
