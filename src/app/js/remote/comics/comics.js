(function () {
    'use strict';

    angular.module('readerApp.remote.comics', [
        'ngRoute',
        'readerApp.remote.comics.controller',
        'readerApp.remote.comics.service',
        'readerApp.service.externalView'
    ]).config(ComicsRoute);

    ComicsRoute.$inject = ['$routeProvider'];

    function ComicsRoute($routeProvider) {
        $routeProvider
            .when('/remote/comics', {
                templateUrl: 'app/js/remote/comics/comics.tpl.html',
                controller: 'ComicsController',
                controllerAs: 'cctrl',
                resolve : {
                    factory : checkModeChosen
                }
            });
    }

    /**
     * @description
     * Check if mode has been chosen, otherwise redirect to home.
     *
     * @param  {Object} $rootScope
     * @param  {Object} $location
     * @param  {Object} externalViewService
     */
    checkModeChosen.$inject = ['$rootScope', '$location', 'ExternalViewService'];
    function checkModeChosen ($rootScope, $location, externalViewService) {
        externalViewService.getCurrentConfig().then(function (response) {
            if (angular.equals({}, response) || !response.modeChosen) {
                $location.path('/');
            }
        });
    }
})();