(function () {
    'use strict';

    angular.module('readerApp.home.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('HomeService', HomeService);

    HomeService.$inject = ['HttpRequestService', 'AppConfig'];
    function HomeService(HttpRequestService, AppConfig) {

        function getAllComics () {
            return HttpRequestService.get({url: AppConfig.URL.ALL_COMICS});
        }

        /**
         * public HomeService api.
         */
        return {
            getAllComics: getAllComics
        };
    }
})();