var name = 'simpleRouter';

var app = {};

/**
 * The default renderer will print the data object
 * @param data
 * @param req
 * @param res
 * @param session
 */
var defaultRenderer=function(data,req,res,session){
    res.addHeader('Content-Type','application/json');
    print(stringify(data));
};

var handle = function (req, res, session, handlers) {
    var log = new Log();
    log.info('Executing the simple-routing logic');

    var result= app.route(req, res, session);
    if (result.hasOwnProperty('error')) {
        log.info('Route not handled');
        handlers({code: result.error,msg:result.msg});
    }

    var methodType=req.getMethod().toLocaleLowerCase();
    var renderer=app.utils(methodType+'-renderer')||defaultRenderer;
    renderer(result.data,req,res,session);
    handlers();
};




var exec = (function (RouteMap) {
    //var RouteMap=require('/themes/default/route-map.js').RouteMap;
    var routes = {};
    var GET_METHOD = 'GET';
    var POST_METHOD = 'POST';
    var PUT_METHOD = 'PUT';
    var DELETE_METHOD = 'DELETE';
    var CONFIG_KEY_RENDERER='renderer';
    var INHERIT_ROUTES=false;
    var config={};
    var log = new Log();


    app.get=function(route,handler){
       register(GET_METHOD,route,handler);
    };

    app.put=function(route,handler){
        register(PUT_METHOD,route,handler);
    };

    app.del=function(route,handler){
        register(DELETE_METHOD,route,handler);
    };

    app.post=function(route,handler){
        register(POST_METHOD,route,handler);
    };

    app.route=function(req,res,session){
        //Determine the method type
        var method=req.getMethod();

        log.info(routes[method].map);
        var match=routes[method].match(req.getRequestURI());

        if((!match)||(!match.ref)){
            return { error: 404 , msg:'Could not find route! ', data:{}};
        }

        req._params=match.params;
        var data=match.ref(req,res,session)||{};
        return {data:data};
    };

    app.config=function(options){
        INHERIT_ROUTES=options.inheritRoutes||false;
    }

    app.utils=function(key,value){

        if(arguments.length==1){
            return config[key];
        }
        else{
            config[key]=value;
        }

    };


    /**
     * The method is used to register a route
     * @param method The HTTP method used for the route
     * @param route  A single route pattern or an array of route patterns
     * @param handler The logic to be executed
     */
    var register=function(method,route,handler){
        //Check if the routes contain a reference to the method type,
        //if not create a new RouteMap
        if(!routes.hasOwnProperty(method)){
            routes[method]=new RouteMap({inherit:INHERIT_ROUTES});
        }

        //Determine if the user has passed in a single route or an array
        if(route instanceof  Array){
            for(var index in route){
                routes[method].add(route[index],handler);
            }
        }
        else{
            routes[method].add(route,handler);
        }
    };

}(RouteMap));
