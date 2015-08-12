(function () {
    'use strict';

    angular.module('readerApp.modal.service', [
        'readerApp.config',
        'readerApp.service.httpRequest'
    ]).factory('ModalService', ModalService);

    ModalService.$inject = ['$filter', 'AppConfig', 'HttpRequestService'];
    function ModalService($filter, AppConfig, HttpRequestService) {

        /**
         * @description
         * Get next chapter.
         *
         * @return {Object}
         */
        function getNextChapter (params) {
            var param = {
                url: AppConfig.URL.CHAPTER_BY_ID + params
            };

            return HttpRequestService.get(param).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Public ModalService API.
         */
        return {
            getNextChapter: getNextChapter
        };
    }
})();