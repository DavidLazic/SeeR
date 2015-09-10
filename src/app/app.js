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

        // main modules
        'readerApp.app',
        'readerApp.home',
        'readerApp.remote',
        'readerApp.modal',

        // services
        'readerApp.service.httpRequest',
        'readerApp.service.httpInterceptor',
        'readerApp.service.utility',
        'readerApp.service.notification',

        // filters
        'readerApp.filter.offset',
        'readerApp.filter.dashRemove',

        // directives
        'readerApp.directive.externalView',
        'readerApp.directive.cReader',
        'readerApp.directive.loader',
        'readerApp.directive.imageLoader',
        'readerApp.directive.animDebounce',
        'readerApp.directive.chapterList',
        'readerApp.directive.scrollHeight',
        'readerApp.directive.switcher'
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
