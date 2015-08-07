(function () {
    'use strict';

    angular.module('readerApp.service.viewModifier', [
        'readerApp.config'
    ]).factory('viewModifierService', viewModifierService);

    viewModifierService.$inject = ['$rootScope', 'AppConfig'];
    function viewModifierService ($rootScope, AppConfig) {

        var defaultConfig = {
            url: null
        };

        var config = {};

        /**
         * @description
         * Get current view config.
         *
         * @return {Object}
         */
        function getCurrentView () {
            return config;
        }

        /**
         * @description
         * Set current view config.
         *
         * @param {Object} | params - params config object ({url: <url>});
         */
        function setCurrentView (params) {
            angular.extend(config, angular.copy(params, defaultConfig));
            $rootScope.$emit(AppConfig.BROADCAST.VIEW_CHANGED, config);
        }

        return {
            getCurrentView: getCurrentView,
            setCurrentView: setCurrentView
        };
    }
})();