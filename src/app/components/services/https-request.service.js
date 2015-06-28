(function () {
    'use strict';

    angular.module('readerApp.httpRequest', [
        'readerApp.config'
    ]).factory('HttpRequestService', HttpRequestService);

    HttpRequestService.$inject = ['$http', '$log', '$q', 'AppConfig'];
    function HttpRequestService ($http, $log, $q, AppConfig) {

        /**
         * @config {Object}
         * @return {Function}
         */
        function httpGet (config) {
            return _doRequest('GET', config);
        }

        function _doRequest (method, config) {
            var params = _configuration(method, config.url, config.data);
            angular.extend(config, params);

            return _httpRequest(config);
        }

        function _configuration (method, url, data) {
            var _url = [AppConfig.URL.ALL, url].join('');
            var params = {};

            if (method === 'GET') params = _configurationGet(_url, data);

            return params;
        }

        function _configurationGet (url, data) {
            var params = {};

            if (!data) {
                params = {
                    method: 'GET',
                    url: url
                };
            }

            return params;
        }

        function _httpRequest (config) {
            var deffered = $q.defer();

            $http(config)
                .success(function (data, status, headers, params) {
                    _logResponse(data, status, params);
                    deffered.resolve(data);
                })
                .error(function (data, status, headers, params) {
                    _logResponse(data, status, params);
                    deffered.reject(data);
                });

            // destroy promise.
            deffered.promise.finally(function () {
                deffered.promise.abort = angular.noop;
                deffered = deffered.promise = null;
            });

            return deffered.promise;
        }

        function _logResponse(data, status, params) {
            $log.debug(data, status, params);
        }

        return {
            get: httpGet
        };
    }
})();