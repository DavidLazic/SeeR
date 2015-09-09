(function () {
    'use strict';

    angular.module('readerApp.service.utility', [
        'readerApp.config'
    ]).factory('UtilityService', UtilityService);

    UtilityService.$inject = ['$q', '$rootScope', 'AppConfig'];
    function UtilityService($q, $rootScope, AppConfig) {

        // Default config for "viewer" directive.
        var defaultConfig = {
                url: null,
                modeChosen: null,
                item: null
            };

        // Default pagination config.
        var paginationConfig = {
                limit: 50,
                offset: 1,
                offsetStart: 0,
                totalCount: 0,
                maxSize: 5
            };

        // Default host config.
        var hostConfig = {
                HOST: '',
                LIST: '',
                COMIC_BY_ID: '',
                COVER: ''
            };

        var config = {};

        /**
         * @description
         * Get current config.
         *
         * @return {Object}
         */
        function getCurrentConfig () {
            return _doRequest(config).then(function (response) {
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
         * Get host config.
         *
         * @return {Object} | params - config object.
         * @return {Object}
         */
        function getHostConfig () {
            angular.extend(hostConfig, angular.copy(AppConfig.HOST[hostConfig.HOST], {}));
            return angular.copy(hostConfig, {});
        }

        /**
         * @description
         * Set host config value.
         *
         * @return {String} | hostValue - chosen host value.
         * @return {Object}
         */
        function setHostValue (hostValue) {
            return angular.extend(hostConfig, {HOST: hostValue});
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
            return _doRequest(config).then(function (response) {
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
            return _doRequest(config).then(function (response) {
                $rootScope.$emit(AppConfig.BROADCAST.ITEM_CHOSEN, config);
                return response;
            });
        }

        /**
         * @description
         * Check currently shown item.
         */
        function checkCurrentItem () {
            $rootScope.$emit(AppConfig.BROADCAST.ITEM_CHECK);
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
            return _doRequest(config).then(function (response) {
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
        function _doRequest (params) {
            return $q.when(params);
        }

        /**
         * @description
         * Public UtilityService API.
         */
        return {
            getPaginationConfig: getPaginationConfig,
            getHostConfig: getHostConfig,
            getCurrentConfig: getCurrentConfig,
            setHostValue: setHostValue,
            setCurrentView: setCurrentView,
            setCurrentItem: setCurrentItem,
            setModeChosen: setModeChosen,
            checkCurrentItem: checkCurrentItem
        };
    }
})();