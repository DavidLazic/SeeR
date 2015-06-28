(function () {
    'use strict';

    angular.module('readerApp.online.comicAll.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('ComicAllService', ComicAllService);

    ComicAllService.$inject = ['HttpRequestService', 'AppConfig'];
    function ComicAllService(HttpRequestService, AppConfig) {

        /**
         * public ComicAllService api.
         */
        return {

        };
    }
})();