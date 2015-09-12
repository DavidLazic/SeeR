(function () {
    'use strict';

    angular.module('readerApp.appService', [
        'readerApp.service.httpRequest',
        'readerApp.service.utility',
        'readerApp.service.notification'
    ]).factory('AppService', AppService);

    AppService.$inject = ['$q', '$filter', 'HttpRequestService', 'UtilityService', 'notificationMessage'];
    function AppService($q, $filter, HttpRequestService, UtilityService, notificationMessage) {

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
         * Create notification.
         *
         * @param  {String} | message - success message.
         * @return {Object}
         * @public
         */
        function sendNotification (message) {
            return $q.when(notificationMessage.info(message));
        }

        /**
         * @description
         * Public AppService API.
         */
        return {
            getDataConfig: getDataConfig,
            getItemModel: getItemModel,
            getChapterById: getChapterById,
            sendNotification: sendNotification
        };
    }
})();