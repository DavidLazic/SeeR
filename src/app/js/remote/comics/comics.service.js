(function () {
    'use strict';

    angular.module('readerApp.remote.comics.service', [
        'readerApp.service.httpRequest',
        'readerApp.service.utility'
    ]).factory('ComicsService', ComicsService);

    ComicsService.$inject = ['$filter', 'HttpRequestService', 'UtilityService'];
    function ComicsService($filter, HttpRequestService, UtilityService) {

        /**
         * @description
         * Get all comics.
         *
         * @return {Object}
         */
        function getAllComics() {
            var hostConfig = _getHostConfig();
            return HttpRequestService.get({url: hostConfig.LIST}).then(function (response) {
                return $filter('orderBy')(response, 'mangaId');
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
            var hostConfig = _getHostConfig(),
                param = {
                    url: hostConfig.COMIC_BY_ID + params
                };

            return HttpRequestService.get(param).then(function (response) {
                response.mangaId = params;
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
            return UtilityService.setCurrentView(param).then(function (response) {
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
            return UtilityService.setCurrentItem(param);
        }

        /**
         * @description
         * Check currently shown item.
         */
        function checkCurrentItem () {
            return UtilityService.checkCurrentItem();
        }

        /**
         * @description
         * Get pagination config.
         *
         * @return {Object}
         */
        function getPaginationConfig () {
            return UtilityService.getPaginationConfig();
        }

        /**
         * @description
         * Get host API config.
         *
         * @return {Object}
         * @private
         */
        function _getHostConfig () {
            return UtilityService.getHostConfig();
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
            setCurrentItem: setCurrentItem,
            checkCurrentItem: checkCurrentItem
        };
    }
})();