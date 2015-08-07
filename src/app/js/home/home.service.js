(function () {
    'use strict';

    angular.module('readerApp.home.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('HomeService', HomeService);

    HomeService.$inject = [];
    function HomeService() {

        /**
         * public HomeService api.
         */
        return {};
    }
})();