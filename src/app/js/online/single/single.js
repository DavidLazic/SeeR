(function () {
    'use strict';

    angular.module('readerApp.online.single', [
        'ngRoute',
        'readerApp.online.single.controller',
        'readerApp.online.single.service'
    ]).config(ComicSingleRoute);

    ComicSingleRoute.$inject = ['$routeProvider'];

    function ComicSingleRoute($routeProvider) {
        $routeProvider
            .when('/online/comics/:id', {
                templateUrl: 'app/js/online/single/single.tpl.html',
                controller: 'ComicSingleController',
                controllerAs: 'csctrl'
            });
    }
})();