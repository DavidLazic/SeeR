(function () {
    'use strict';

    angular.module('readerApp', [
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngResource',
        'ngRoute',
        'ui.bootstrap',

        'readerApp.app',
        'readerApp.home',
        'readerApp.online',

        'readerApp.filter.offset',
        'readerApp.directive.externalView',
        'readerApp.service.httpRequest',
        'readerApp.service.externalView'
    ]).config(function ($routeProvider, AppConfig) {
        $routeProvider
            .otherwise({
                redirectTo: AppConfig.ROUTE.DEFAULT
            });
    }).run(AppRun);

    AppRun.$inject = ['$rootScope', '$http', 'AppConfig'];
    function AppRun ($rootScope, $http, AppConfig) {

        // Enable CORS
        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common[AppConfig.HEADER.COMMON];
    }
})();
