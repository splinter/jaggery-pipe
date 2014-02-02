var TENANT_URL_PATTERN='/{context}/t/{tenantId}/{resource}';
var PARAM_IS_TENANT='isTenant';
var PARAM_TENANT_ID='tenantId';
var DEFAULT_SUPER_TENANT_ID='carbon.super';

/*
This plug-in is used to obtain the tenant details if any is present.
It looks for the t symbol in the url to check for a tenant
 */
var handle=function(req,res,session,handlers){
     log.info('Parsing request uri');

     var uriMatcher=new URIMatcher(req.getRequestURI());
     log.info('Request: '+req.getRequestURI());
     log.info('Match '+TENANT_URL_PATTERN);

     //If there is a uri match then this is a tenant
     if(uriMatcher.match(TENANT_URL_PATTERN)){
           log.info('Tenant: '+uriMatcher.tenantId);
           session.put(PARAM_IS_TENANT,true);
           session.get(PARAM_TENANT_ID,matcher.tenantId);
     }
    else{
         session.put(PARAM_TENANT_ID,DEFAULT_SUPER_TENANT_ID);
     }

    log.info('Tenant: '+session.get(PARAM_TENANT_ID));

     handlers();

};