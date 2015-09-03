(function () {
    'use strict';

    angular.module('readerApp.appService', [
        'readerApp.service.httpRequest',
        'readerApp.service.utility'
    ]).factory('AppService', AppService);

    AppService.$inject = ['$filter', 'HttpRequestService', 'UtilityService'];
    function AppService($filter, HttpRequestService, UtilityService) {

        var hostConfig = {};

        var dataConfig = {
                name: null,
                chapterIndex: 0,
                chapters: [],
                currentChapter: null
            };

        var itemModel = {
                cover: '/images/no-cover.png'
            };

        var cfg = {};

        /**
         * @description
         * Get data config object.
         *
         * @return {Object}
         */
        function getDataConfig () {
            return angular.extend(cfg, angular.copy(dataConfig, {}));
        }

        /**
         * @description
         * Get default item model.
         *
         * @return {Object}
         */
        function getItemModel () {
            return angular.copy(itemModel, {});
        }

        /**
         * @description
         * Get chapter by id.
         *
         * @param  {Object} | params - current comic config object. {comic: <name>, chapterId: <id>}
         * @return {Object}
         */
        function getChapterById (params) {
            angular.copy(UtilityService.getHostConfig(), hostConfig);
            var param = {
                url: hostConfig.COMIC_BY_ID + params.comic + '/' + params.chapterId
            };

            return HttpRequestService.get(param).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Public AppService API.
         */
        return {
            getDataConfig: getDataConfig,
            getItemModel: getItemModel,
            getChapterById: getChapterById
        };
    }
})();