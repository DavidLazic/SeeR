(function () {
    'use strict';

    angular.module('readerApp.home.service', [
        'readerApp.service.utility',
        'readerApp.config'
    ]).factory('HomeService', HomeService);

    HomeService.$inject = ['UtilityService'];
    function HomeService(UtilityService) {

        /**
         * @description
         * Set config for the current view fn.
         *
         * @param {Object} | param - view config.
         * @return {Object}
         */
        function setCurrentView (param) {
            return UtilityService.setCurrentView(param).then(function (response) {
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