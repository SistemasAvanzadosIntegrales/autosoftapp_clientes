document.addEventListener('deviceready', function () {
    var session = JSON.parse(localStorage.getItem('session'));
<<<<<<< HEAD
    var app_settings = JSON.parse(localStorage.getItem('app_settings'));
=======
    var app_settings = JSON.parse(localStorage.getItem('app_settings')); 
>>>>>>> d62ece4c00401e0992531b0381bc16f34ed81423
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    try {
        var notificationOpenedCallback = function(jsonData) {
            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };
        window.plugins.OneSignal
            .startInit("9279844e-0f7c-4469-a616-79df5e864a5a")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        var session=JSON.parse(localStorage.getItem('session'));
        window.plugins.OneSignal.sendTag("rol",app_settings.rol+session.token);
        window.plugins.OneSignal.sendTag("id", app_settings.user.id+session.token);

    } catch (e) {
        console.log(e);
    }


}, false);
