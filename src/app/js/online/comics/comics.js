(function () {
    'use strict';

    angular.module('readerApp.online.comics', [
        'ngRoute',
        'readerApp.online.comics.controller',
        'readerApp.online.comics.service'
    ]).config(ComicsRoute);

    ComicsRoute.$inject = ['$routeProvider'];

    function ComicsRoute($routeProvider) {
        $routeProvider
            .when('/online/comics', {
                templateUrl: 'app/js/online/comics/comics.tpl.html',
                controller: 'ComicsController',
                controllerAs: 'cctrl'
            });
    }
})();