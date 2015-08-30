(function () {
    'use strict';

    angular.module('readerApp.service.httpRequest', [
        'readerApp.config'
    ]).factory('HttpRequestService', HttpRequestService);

    HttpRequestService.$inject = ['$http', '$log', '$q', 'AppConfig'];
    function HttpRequestService($http, $log, $q, AppConfig) {

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

        function _doRequest(method, params) {
            var config = _configuration(method, params.url, params.data);
            angular.extend(params, config);

            return _httpRequest(params);
        }

        function _configuration(method, url, data) {
            var _url = [AppConfig.URL.BASE, url].join('');
            var config = {};

            if (method === 'GET') {
                config = _configurationGet(_url, data);
            }

            return config;
        }

        function _configurationGet(url, data) {
            var config = {};

            if (data) {
                config = {
                    method: 'GET',
                    url: url,
                    transformRequest: _formPostParamTransformFn,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    params: data,
                    cache: true
                };
            } else {
                config = {
                    method: 'GET',
                    url: url,
                    cache: true
                };
            }

            return config;
        }

        function _httpRequest(params) {
            var deffered = $q.defer();

            $http(params)
                .success(function (data, status, headers, config) {
                    _logResponse(data, status, config);
                    deffered.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    _logResponse(data, status, config);
                    deffered.reject(data);
                });

            // destroy promise.
            deffered.promise.finally(function () {
                deffered.promise.abort = angular.noop;
                deffered = deffered.promise = null;
            });

            return deffered.promise;
        }

        function _logResponse(data, status, config) {
            $log.debug(data, status, config);
        }

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
         * Public HttpRequestService API.
         */
        return {
            get: httpGet
        };
    }
})();