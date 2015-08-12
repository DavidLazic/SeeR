(function () {
    'use strict';

    angular.module('readerApp.service.externalView', [
        'readerApp.config'
    ]).factory('ExternalViewService', ExternalViewService);

    ExternalViewService.$inject = ['$q', '$rootScope', 'AppConfig'];
    function ExternalViewService($q, $rootScope, AppConfig) {

        // Default config for "viewer" directive.
        var defaultConfig = {
                url: null,
                modeChosen: null,
                item: null
            };

        // Default pagination config.
        var paginationConfig = {
                limit: 30,
                offset: 1,
                offsetStart: 0,
                totalCount: 0,
                maxSize: 5
            };

        var config = {};

        /**
         * @description
         * Get current config.
         *
         * @return {Object}
         */
        function getCurrentConfig () {
            return _doRequest()(config).then(function (response) {
                return response;
            });
        }

        /**
         * @description
         * Get pagination config.
         *
         * @param {Object} | params - config object.
         * @return {Object}
         */
        function getPaginationConfig (params) {
            return angular.extend(paginationConfig, angular.copy(paginationConfig, params));
        }

        /**
         * @description
         * Set config for current view.
         *
         * @param {Object} | params - params config object ({url: <url>}).
         * @return {Object}
         */
        function setCurrentView (params) {
            _setConfig(params);
            return _doRequest()(config).then(function (response) {
                $rootScope.$emit(AppConfig.BROADCAST.VIEW_CHANGED, config);
                return response;
            });
        }

        /**
         * @description
         * Set config for current item.
         *
         * @param {Object} | params - params config object ({item: <item>}).
         * @return {Object}
         */
        function setCurrentItem (params) {
            _setConfig(params);
            return _doRequest()(config).then(function (response) {
                $rootScope.$emit(AppConfig.BROADCAST.ITEM_CHOSEN, config);
                return response;
            });
        }

        /**
         * @description
         * Set config for current mode.
         *
         * @param {Object} | params - params config object ({modeChosen: <modeChosen>}).
         * @return {Object}
         */
        function setModeChosen (params) {
            _setConfig(params);
            return _doRequest()(config).then(function (response) {
                return response;
            });
        }


        function _setConfig (params) {
            return angular.extend(config, angular.copy(params, defaultConfig));
        }

        /**
         * @description
         * Resolve promise for given object.
         *
         * @param {Object} | params - new config object.
         * @return {Object}
         * @private
         */
        function _doRequest () {
            var deffered = $q.defer();
            return function (params) {
                deffered.resolve(params);
                return deffered.promise;
            };
        }

        /**
         * @description
         * Public ExternalViewService API.
         */
        return {
            getPaginationConfig: getPaginationConfig,
            getCurrentConfig: getCurrentConfig,
            setCurrentView: setCurrentView,
            setCurrentItem: setCurrentItem,
            setModeChosen: setModeChosen
        };
    }
})();