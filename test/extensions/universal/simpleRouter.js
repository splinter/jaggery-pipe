var name = 'simpleRouter';

var app = {};

var handle = function (req, res, session, handlers) {
    var log = new Log();
    log.info('Executing the simple-routing logic');
    var routed = app.route(req, res, session);
    if (!routed) {
        log.info('Route not handled');
        handlers({code: 401});
    }

    handlers();
};

var exec = (function () {

    var routes = {};
    var overridenRoutes = {};
    var GET_METHOD = 'GET';
    var POST_METHOD = 'POST';
    var PUT_METHOD = 'PUT';
    var DELETE_METHOD = 'DELETE';
    var log = new Log();

    /*
     The method is used to register a route
     */
    var register = function (method, route, handler) {
        if (!routes.hasOwnProperty(method)) {
            routes[method] = {};
        }

        if (route instanceof  Array) {
            var routeComponent;
            for (var index in route) {
                routeComponent = route[index];
                routes[method][routeComponent] = {};
                routes[method][routeComponent]['handle'] = handler;
            }
        }
        else {
            routes[method][route] ={}
            routes[method][route]['handle']=handler;
        }

    };

    var registerObject = function (obj, route) {

        for (var prop in obj) {
            switch (prop) {
                case GET_METHOD:
                    register(GET_METHOD, route, obj[prop]);
                    break;
                case POST_METHOD:
                    register(POST_METHOD, route, obj[prop]);
                    break;
                case DELETE_METHOD:
                    register(DELETE_METHOD, route, obj[prop]);
                    break;
                case PUT_METHOD:
                    register(PUT_METHOD, route, obj[prop]);
                    break;
                default:
                    break;
            }
        }
    };

    var resolveHandlerType = function (method, route, obj) {

        if (obj instanceof Function) {
            register(method, route, obj);
        }
        else {
            //Allow the object to register itself
            obj(this);
        }
    };

    /*
     The method is used to override routes
     */
    var overrideHandlerType = function (method, originalRoute, newRoute, obj) {
        var methodRouteMappings = routes[method];
        var routeMapping;
        //Find the route to override
        for (var route in methodRouteMappings) {
            routeMapping=methodRouteMappings[route];
            if (route == originalRoute) {
                //Check if overrides exist
                if (!routeMapping.hasOwnProperty('overrides')) {
                    routeMapping['overrides'] = [];
                }
                var entry={};
                entry['route']=newRoute;
                entry['handle']=obj;

                routeMapping.overrides.push(entry);
            }
        }

        log.info(stringify(routes));
    };

    app.get = function (route, handler) {
        resolveHandlerType(GET_METHOD, route, handler);
    };

    app.overrideGet = function (oldRoute, newRoute, handler) {
        overrideHandlerType(GET_METHOD, oldRoute, newRoute, handler);
    };

    app.put = function (route, handler) {
        resolveHandlerType(PUT_METHOD, route, handler);
    };

    app.overridePut = function (oldRoute,newRoute,handler){
        overrideHandlerType(PUT_METHOD,oldRoute,newRoute, handler);
    };

    app.post = function (route, handler) {
        resolveHandlerType(POST_METHOD, route, handler);
    };

    app.overridePost=function(oldRoute,newRoute,handler){
        overrideHandlerType(POST_METHOD,oldRoute,newRoute,handler);
    };

    app.delete = function (route, handler) {
        resolveHandlerType(DELETE_METHOD, route, handler);
    };

    app.overrideDelete=function(oldRoute,newRoute,handler){
        overrideHandlerType(DELETE_METHOD,oldRoute,newRoute,handler);
    };

    app.registerRoutes = function (handler) {
        resolveHandlerType(null, null, handler);
    };

    /*
    The function determines which overriden handler should be executed
     */
    var resolveOverride=function(req,res,session,routeMapping,uriMatcher){
        var overrides=routeMapping.overrides;
        var currentRoute;

        log.info(stringify(overrides));
        for(var index in overrides){
            currentRoute=overrides[index].route;
            log.info('current route:' +stringify(currentRoute));
            if(uriMatcher.match(currentRoute)){
                log.info('Found override mapping');
                 return routeMapping.overrides[index].handle(req,res,{session:session,arguments:uriMatcher.elements()});
            }
        }

        return null;
    };

    app.route = function (req, res, session) {
        //Determine the type of method
        var method = req.getMethod();
        var data;
        var routeMappings = routes[method];
        var uriMatcher = new URIMatcher(req.getRequestURI());
        log.info('Routing request: ' + req.getRequestURI());

        for (var route in routeMappings) {

            //Check if the route matches
            if (uriMatcher.match(route)) {

                log.info('arguments: ');
                log.info(uriMatcher.elements());
                log.info('***********');

                //Check if there are any overrides to match against
                if(routeMappings[route].hasOwnProperty('overrides'))
                {

                    data=resolveOverride(req,res,session,routeMappings[route],uriMatcher);
                }

                if(!data){
                    //If there are no overrides use the default
                    routeMappings[route].handle(req, res, {session: session, arguments: uriMatcher.elements()});
                }

                return true;
            }
        }

        return false;
    };

}());
