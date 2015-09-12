(function () {
    'use strict';

    angular.module('readerApp.modal.service', [
        'readerApp.service.httpRequest',
        'readerApp.service.utility',
        'readerApp.service.notification'
    ]).factory('ModalService', ModalService);

    ModalService.$inject = ['$q', '$filter', 'HttpRequestService', 'UtilityService', 'notificationMessage'];
    function ModalService($q, $filter, HttpRequestService, UtilityService, notificationMessage) {

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
        function sendNotification (message, messageType) {
            return $q.when(notificationMessage[messageType](message));
        }

        /**
         * @description
         * Public ModalService API.
         */
        return {
            getChapterById: getChapterById,
            sendNotification: sendNotification
        };
    }
})();