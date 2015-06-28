(function () {
    'use strict';

    angular.module('readerApp.online.comicAll', [
        'ngRoute',
        'readerApp.online.comicAll.controller',
        'readerApp.online.comicAll.service'
    ]).config(ComicAllRoute);

    ComicAllRoute.$inject = ['$routeProvider'];

    function ComicAllRoute ($routeProvider) {
        $routeProvider
            .when('/online/list', {
                templateUrl: 'app/js/online/comic-all/comic-all.tpl.html',
                controller: 'ComicAllController',
                controllerAs: 'caCtrl'
            });
    }
})();