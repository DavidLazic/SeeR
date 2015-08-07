(function () {
    'use strict';

    angular.module('readerApp.online.single.service', [
        'readerApp.httpRequest',
        'readerApp.config'
    ]).factory('ComicSingleService', ComicSingleService);

    ComicSingleService.$inject = [];
    function ComicSingleService() {

        /**
         * public ComicSingleService API.
         */
        return {

        };
    }
})();