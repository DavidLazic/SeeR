(function () {
    'use strict';

    angular.module('readerApp.home.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('HomeService', HomeService);

    HomeService.$inject = ['HttpRequestService', 'AppConfig'];
    function HomeService(HttpRequestService, AppConfig) {

        /**
         * public HomeService api.
         */
        return {};
    }
})();