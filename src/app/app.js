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
        'readerApp.remote',
        'readerApp.modal',

        'readerApp.service.httpRequest',
        'readerApp.service.utility',
        'readerApp.filter.offset',
        'readerApp.directive.externalView',
        'readerApp.directive.cReader'
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
        $http.defaults.headers.common['X-Mashape-Key'] = AppConfig.HEADER.MASH_KEY;
    }
})();
