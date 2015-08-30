(function () {
    'use strict';

    angular.module('readerApp.modal.service', [
        'readerApp.service.httpRequest',
        'readerApp.service.utility'
    ]).factory('ModalService', ModalService);

    ModalService.$inject = ['$filter', 'HttpRequestService', 'UtilityService'];
    function ModalService($filter, HttpRequestService, UtilityService) {

        var hostConfig = UtilityService.getHostConfig();

        /**
         * @description
         * Get chapter by id.
         *
         * @param  {Object} | params - current comic config object. {comic: <name>, chapterId: <id>}
         * @return {Object}
         */
        function getChapterById (params) {
            var param = {
                url: hostConfig.COMIC_BY_ID + '-' + params.comic + '/' + params.chapterId
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
            getChapterById: getChapterById
        };
    }
})();