(function () {
    'use strict';

    angular.module('readerApp.online.comicAll.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('ComicAllService', ComicAllService);

    ComicAllService.$inject = ['$filter', 'HttpRequestService', 'AppConfig'];
    function ComicAllService($filter, HttpRequestService, AppConfig) {

        /**
         * Get all comics.
         *
         * @return {Object}
         */
        function getAllComics() {
            return HttpRequestService.get({url: AppConfig.URL.ALL_COMICS}).then(function (response) {
                return $filter('orderBy')(response.manga, 't');;
            });
        }

        /**
         * public ComicAllService API.
         */
        return {
            getAllComics: getAllComics
        };
    }
})();