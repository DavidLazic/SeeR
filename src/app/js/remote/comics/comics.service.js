(function () {
    'use strict';

    angular.module('readerApp.remote.comics.service', [
        'readerApp.service.httpRequest',
        'readerApp.service.externalView',
        'readerApp.config',
    ]).factory('ComicsService', ComicsService);

    ComicsService.$inject = ['$filter', 'HttpRequestService', 'ExternalViewService', 'AppConfig'];
    function ComicsService($filter, HttpRequestService, externalViewService, AppConfig) {

        /**
         * @description
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
         * @description
         * Get single comic.
         *
         * @param {Object} | param - single comic config object.
         * @return {Object}
         */
        function getSingleComic (params) {
            var param = {
                url: AppConfig.URL.COMIC_BY_ID + params
            };

            return HttpRequestService.get(param).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Set current directive view.
         *
         * @param {Object} | param - config view object.
         */
        function setCurrentView (param) {
            return externalViewService.setCurrentView(param).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Set current comic item.
         *
         * @param {Object} | param - comic item object.
         * @return {Object}
         */
        function setCurrentItem (param) {
            return externalViewService.setCurrentItem(param).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Get pagination config.
         *
         * @return {Object}
         */
        function getPaginationConfig () {
            return externalViewService.getPaginationConfig();
        }

        /**
         * @description
         * Public ComicsService API.
         */
        return {
            getAllComics: getAllComics,
            getPaginationConfig: getPaginationConfig,
            getSingleComic: getSingleComic,
            setCurrentView: setCurrentView,
            setCurrentItem: setCurrentItem
        };
    }
})();