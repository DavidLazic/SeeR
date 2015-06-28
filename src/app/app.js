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
        'readerApp.online'
    ]).config(function ($routeProvider, AppConfig) {
        $routeProvider
            .otherwise({
                redirectTo: AppConfig.ROUTE.DEFAULT
            });
    }).run(AppRun);

    AppRun.$inject = ['$rootScope', '$http', 'AppConfig', 'HttpRequestService'];
    function AppRun ($rootScope, $http, AppConfig, HttpRequestService) {

        // Enable CORS
        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common[AppConfig.HEADER.COMMON];
        $rootScope.cache = {};
    }
})();
