(function () {
    'use strict';

    angular.module('readerApp.service.httpRequest', [
        'readerApp.config',
        'readerApp.service.notification'
    ]).factory('HttpRequestService', HttpRequestService);

    HttpRequestService.$inject = ['$http', '$log', '$q', 'AppConfig', 'notificationMessage'];
    function HttpRequestService($http, $log, $q, AppConfig, notificationMessage) {

        var successMessage = 'Data has been successfully saved.',
            errorGetMessage = 'Error occurred while trying to load data.';

        var messagesConfig = {
            success: {
                text: '',
                enabled: true
            },
            error: {
                text: '',
                enabled: true
            }
        };

        /**
         * @description
         * Get messages config.
         *
         * @return {Object}
         * @public
         */
        function getMessagesConfig () {
            return angular.copy(messagesConfig);
        }

        /**
         * @description
         * Http GET request.
         *
         * @params {Object} | params - config object.
         * @return {Object}
         */
        function httpGet(params) {
            return _doRequest('GET', params);
        }

        /**
         * @description
         * Start HTTP request.
         *
         * @param  {String} | method
         * @param  {Object} | params
         * @return {Object}
         * @private
         */
        function _doRequest(method, params) {
            var config = _configuration(method, params.url, params.data);
            angular.extend(params, config);

            return _httpRequest(params);
        }

        /**
         * @description
         * Get HTTP config.
         *
         * @param  {String} | method
         * @param  {String} | url
         * @param  {Object} | data
         * @return {Object}
         * @private
         */
        function _configuration(method, url, data) {
            var _url = AppConfig.URL.BASE + url;
            var config = {};

            if (method === 'GET') {
                config = _configurationGet(_url, data);
            }

            return config;
        }

        /**
         * @description
         * Get HTTP config.
         *
         * @param  {String} | url
         * @param  {Object} | data
         * @return {Object}
         * @private
         */
        function _configurationGet(url, data) {
            var config = {};

            if (data) {
                config = {
                    method: 'GET',
                    url: url,
                    transformRequest: _formPostParamTransformFn,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    params: data,
                    timeout: 10000,
                    cache: true
                };
            } else {
                config = {
                    method: 'GET',
                    url: url,
                    timeout: 10000,
                    cache: true
                };
            }

            return config;
        }

        /**
         * @description
         * Send HTTP request.
         *
         * @param  {Object} | params
         * @return {Object}
         * @private
         */
        function _httpRequest(params) {
            var deffered = $q.defer();

            $http(params)
                .success(function (data, status, headers, config) {
                    _displaySuccess(params, data, status, config);
                    deffered.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    _displayError(params, data, status, config);
                    deffered.reject(data);
                });

            // destroy promise.
            deffered.promise.finally(function () {
                deffered.promise.abort = angular.noop;
                deffered = deffered.promise = null;
            });

            return deffered.promise;
        }

        /**
         * @description
         * Log HTTP response.
         *
         * @param  {Object}  | data
         * @param  {Integer} | status
         * @param  {Object}  | config
         * @return {Object}
         * @private
         */
        function _logResponse(data, status, config) {
            $log.debug(data, status, config);
        }

        /**
         * @description
         * Transform URI.
         *
         * @param  {Object}
         * @return {String}
         * @private
         */
        function _formPostParamTransformFn(obj) {
            var str = [];

            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    str.push(encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]));
                }

            }

            return str.join('&');
        }

        /**
         * @description
         * Display response success.
         *
         * @param  {Object}  | params
         * @param  {Object}  | data
         * @param  {Integer} | status
         * @param  {Object}  | config
         * @private
         */
        function _displaySuccess (params, data, status, config) {
            _logResponse(data, status, config);

            if (config.method !== 'GET') {
                var messages = angular.extend(getMessagesConfig(), params.messages);
                if (messages.success.text === 0) {
                    messages.success.text = successMessage;
                }

                if (messages.success.enabled) {
                    notificationMessage.success(messages.success.text);
                }
            }
        }

        /**
         * @description
         * Display response error.
         *
         * @param  {Object}  | params
         * @param  {Object}  | data
         * @param  {Integer} | status
         * @param  {Object}  | config
         * @private
         */
        function _displayError (params, data, status, config) {
            _logResponse(data, status, config);

            var messages = angular.extend(getMessagesConfig(), params.messages);
            messages.error.text = _isTimeout(status);

            if (messages.error.enabled) {
                notificationMessage.error(messages.error.text);
            }

        }

        /**
         * @description
         * Check if the error is timeout caused.
         *
         * @param  {Integer} | status - response status.
         * @return {Bool}
         * @private
         */
        function _isTimeout (status) {
            return ([0, 408].indexOf(status) !== -1) ? 'Sorry, server is taking too long to respond.' : errorGetMessage;
        }

        /**
         * @description
         * Public HttpRequestService API.
         */
        return {
            getMessagesConfig: getMessagesConfig,
            get: httpGet
        };
    }
})();