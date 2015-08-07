(function () {
    'use strict';

    angular.module('readerApp.online.comics.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('ComicsService', ComicsService);

    ComicsService.$inject = ['$filter', 'HttpRequestService', 'AppConfig'];
    function ComicsService($filter, HttpRequestService, AppConfig) {

        /**
         * Get all comics.
         *
         * @return {Object}
         */
        function getAllComics() {
            return HttpRequestService.get({url: AppConfig.URL.ALL_COMICS}).then(function (response) {
                return $filter('orderBy')(response.manga, 't');
            });
        }

        /**
         * public ComicsService API.
         */
        return {
            getAllComics: getAllComics
        };
    }
})();