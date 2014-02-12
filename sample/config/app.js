var caramel = require('caramel');

caramel.configs({
    context: '/sample',
    cache: false,
    negotiation: true,
    themer: function () {
        return 'default';
    }
});