(function () {
    'use strict';

    angular.module('readerApp.home', [
        'ngRoute',
        'readerApp.home.controller',
        'readerApp.home.service'
    ]).config(HomeRoute);

    HomeRoute.$inject = ['$routeProvider'];

    function HomeRoute ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/js/home/home.tpl.html',
                controller: 'HomeController',
                controllerAs: 'homeCtrl'
            });
    }
})();