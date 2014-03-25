/*
Description: This plugin provides basic authentication capabilities, to secure a url install the plugin
             to the required route (or root if the entire site needs to be secured)
Filename:   basicAuth.js
Created Date: 3/2/2014
 */
var name = 'defaultBasicAuth';

/*
The default authenticator, a user can pass in their own function
 */
var authenticator=function(session,args){
    session.put("LOGGED_IN_USER", args.username);
    session.put("Loged", "true");
    return true;
};

/*
The method is used to check if there is a logged in user.
 */
var isLoggedIn=function(session){
    var isLogged=session.get('Loged');
    if(isLogged){
        return true;
    }
    return false;
};

/*
The method is used to decode the authentication header sent by the user
 */
var decodeCredentials=function(authHeader){
    var comps=authHeader.split(' ');
    var Util=org.opensaml.xml.util.Base64;
    var result=new java.lang.String(Util.decode(comps[1]));
    var creds=result.split(':');
    return { username: creds[0],password:creds[1]};
};

var challengeAuth=function(req,res){
    res.addHeader('WWW-Authenticate','Basic realm="restricted"');
    res.sendError(401);
};

var handle = function (req, res, session, handlers) {
    var log = new Log();
    log.info('Basic authentication handler called!');

    //Check the session to see if the user has been logged
    if(isLoggedIn(session)){

        //Call the other handlers
        handlers();

    }
    else{
        //Check if the user has sent an Authorization
        var authHeader=req.getHeader('Authorization');

        //If the user has provided the auth header do an authentication check
        if(authHeader){
            var credentials=decodeCredentials(authHeader);
            var isAuthenticated=authenticator(session,credentials);

            if(!isAuthenticated){
                log.info('Authentication failed');
                challengeAuth(req,res);
            }
            else{
                log.info('Authentication successfull');
                //Invoke the other plugins
                handlers();
            }
        }
        else{
            //Challenge the user for authentication
            challengeAuth(req,res);
        }
    }
};
