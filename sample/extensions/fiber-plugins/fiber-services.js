var fiberServices = function (fiber, options) {
    var log = new Log('fiber-services');

    fiber.on('services', 'init', function (context) {

        var servicesDir = context.dir;
        var extension = context.extension;

        //List the contents of the directory
        var serviceFiles = servicesDir.listFiles();

        for (var index in serviceFiles) {
            log.info('Found the following services: ' + serviceFiles[index].getName());
        }

    });

};
