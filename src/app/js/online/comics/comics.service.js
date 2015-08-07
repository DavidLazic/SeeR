(function () {
    'use strict';

    angular.module('readerApp.online.comics.service', [
        'readerApp.httpRequest',
        'readerApp.service.viewModifier',
        'readerApp.config',
    ]).factory('ComicsService', ComicsService);

    ComicsService.$inject = ['$filter', 'HttpRequestService', 'viewModifierService', 'AppConfig'];
    function ComicsService($filter, HttpRequestService, viewModifierService, AppConfig) {

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
         * @return {Object}
         */
        function getSingleComic () {
            return HttpRequestService.get({url: AppConfig.URL.SINGLE_COMIC}).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Set current directive view.
         *
         * @param {[type]} param [description]
         */
        function setCurrentView (param) {
            return viewModifierService.setCurrentView(param).then(function (response) {
                console.log('service response', response);
            });
        }

        /**
         * public ComicsService API.
         */
        return {
            getAllComics: getAllComics,
            getSingleComic: getSingleComic,
            setCurrentView: setCurrentView
        };
    }
})();