(function () {
    'use strict';

    angular.module('readerApp.service.httpInterceptor', [])
        .factory('httpInterceptor', httpInterceptor)
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
        }]);

    httpInterceptor.$inject = ['$q', '$location'];
    function httpInterceptor($q, $location) {
        return {

            'request': function (config) {
                return config || $q.when(config);
            },

            'requestError': function (rejection) {
                return $q.reject(rejection);
            },

            'response': function (response) {
                return response || $q.when(response);
            },

            'responseError': function (rejection) {

                if ([401, 404].indexOf(rejection.status) !== -1) {
                    $location.path('/');
                }

                return $q.reject(rejection);
            }
        };
    }
})();
