var logoutUser = function (req, res,session) {
    var log=new Log();
    log.info('Invalidating user');
    session.put("LOGGED_IN_USER", null);
    session.put("Loged", "falser ");
    session.invalidate();
    print('User has been logged out!');
};