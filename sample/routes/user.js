var logoutUser = function (req, res,session) {
    session.put("LOGGED_IN_USER", null);
    session.put("Loged", "falser ");
    session.invalidate();
    var data={
        code:200,
        msg:'User has been logged out!'
    };

    res._render(data);
};