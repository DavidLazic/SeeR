(function () {
    'use strict';

    angular.module('readerApp.home.service', [
        'readerApp.service.externalView',
        'readerApp.config'
    ]).factory('HomeService', HomeService);

    HomeService.$inject = ['ExternalViewService'];
    function HomeService(externalViewService) {

        /**
         * @description
         * Set config for the current view fn.
         *
         * @param {Object} | param - view config.
         * @return {Object}
         */
        function setCurrentView (param) {
            return externalViewService.setCurrentView(param).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Public HomeService API.
         */
        return {
            setCurrentView: setCurrentView
        };
    }
})();