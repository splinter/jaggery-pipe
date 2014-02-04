var log = new Log();

var getAsset = function (req, res, session) {
    print('Getting asset details');
    log.info('Retrieving asset details for ' + session.arguments.type);
    return {};
};

var updateAsset = function (req, res, session) {
    log.info('Updating asset details for ' + session.arguments.type);
    print('Updating asset details for ' + session.arguments.type);
    return {};
};

var deleteAsset = function (req, res, session) {
    log.info('Deleting asset details for ' + session.arguments.type);
    print('Deleting asset details for ' + session.arguments.type);
    return {};
};

var createAsset = function (req, res, session) {
    log.info('Creating asset details for ' + session.arguments.type);
    print('Creating asset details for ' + session.arguments.type);
    return {};
};


var topSuperTenantAsset = function (req, res, session) {
    log.info('Generic top assets page for the super tenant');
    print('Generic Top Assets page');
    return {};
};

var topTenantAsset = function (req, res, context) {
    var tenant = context.session.get('tenantId');
    log.info('Generic top assets page for tenant ' + tenant);
    print('Generic Top Assets page for ' + tenant);
    return {};
};

var overridenSuperTenantAsset = function (req, res, context) {
    print('Used to be the Generic top assets page for the super tenant, Not Anymore!');
    return {};
};