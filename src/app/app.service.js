(function () {
    'use strict';

    angular.module('readerApp.appService', [
        'readerApp.service.httpRequest',
        'readerApp.config',
    ]).factory('AppService', AppService);

    AppService.$inject = ['$filter', 'HttpRequestService', 'AppConfig'];
    function AppService($filter, HttpRequestService, AppConfig) {

        /**
         * @description
         * Get chapter by id.
         *
         * @param  {String} | chapterId - current chapter id.
         * @return {Object}
         */
        function getChapterById (chapterId) {
            var param = {
                url: AppConfig.URL.CHAPTER_BY_ID + chapterId
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
            getChapterById: getChapterById
        };
    }
})();