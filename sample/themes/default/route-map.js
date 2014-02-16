var RouteMap = {};

var module = (function () {

    var map = {};
    var log = new Log();

    var add = function (route,ref) {
        splitToComponents(route,ref);
    };

    var match=function(route){
        var components=route.split('/');
        components=cleanseComponents(components);
        var result=traverse(map,components,0);
        log.info('*** Result ***');
        log.info(result);

        return result;
    };

    var splitToComponents = function (route,ref) {
        var components = route.split('/');
        components = cleanseComponents(components);
        buildMap(map, components, 0,ref);
    };

    var traverse=function(mapObj,components,index){
        if(components.length<=index){
             log.info('Getting reference');
             log.info(mapObj);
             var ref= getRef(mapObj);
             log.info('ref is '+ref);
            return ref;
        }
        else{
            var comp=components[index];
            index++;
            log.info('Matching comp: '+comp);
            if(mapObj.hasOwnProperty(comp)){
                log.info('Match');
                return traverse(mapObj[comp],components,index);
            }
            else{
                log.info('Looking for default');
                var def=getDefaultRoute(mapObj);
                log.info('def: '+stringify(def));
                if(!def){
                    return def;
                }

                return traverse(def,components,index);
            }
        }
    };

    var buildMap = function (mapObj, components, index,ref) {
        //Stop building the map if there are no more components to place
        if (components.length <= index) {
            mapObj['_ref']=ref;
            return;
        }
        else {
            var comp = components[index];
            var cleansed=removeTokens(comp);

            index++;

            //If a route does not exist then make one
            if (!mapObj.hasOwnProperty(cleansed)) {
                mapObj[cleansed] = {};
                if(isToken(comp)){
                    mapObj['_def']=cleansed;
                }
            }
            buildMap(mapObj[cleansed], components, index,ref);

        }
    };

    /**
     * The method goes through each component andd cleanses the components
     * of the { and  : tokens
     * @param components
     * @return: An array of components cleansed of any tokens
     */
    var cleanseComponents = function (components) {
        var cleansed = [];
        var component;
        for (var index in components) {
            component = components[index];//removeTokens(components[index]);

            if (component != '') {
                cleansed.push(component);
            }

        }
        return cleansed;
    };

    var isToken=function(component){
        var tokens = ['{', ':'];

        for(var index in tokens){
            if(component.indexOf(tokens[index])>=0){
                return true;
            }
        }

        return false;
    };

    var removeTokens = function (component) {
        var tokens = ['{', '}', ':'];
        var cleansed = component;
        for (var index in tokens) {
            cleansed = cleansed.replace(tokens[index], '');
        }
        return cleansed;
    };

    /**
     * The function returns the default route for a given level of the route map
     * @param obj The current level
     * @returns The default route for that level if one is found,else null
     */
    var getDefaultRoute=function(obj){
        var def;

        if(obj.hasOwnProperty('_def')){
             def=obj['_def'];
            return obj[def];
        }
        return null;
    };

    var getRef=function(obj){
       log.info('Get Ref');
       log.info(obj['_ref']);
       if(obj.hasOwnProperty('_ref')){
           log.info('Found a ref');
           return obj['_ref'];
       }
        return null;
    }


    RouteMap.map = map;
    RouteMap.add = add;
    RouteMap.match=match;

}());