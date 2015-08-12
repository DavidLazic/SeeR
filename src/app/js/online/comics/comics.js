(function () {
    'use strict';

    angular.module('readerApp.online.comics', [
        'ngRoute',
        'readerApp.online.comics.controller',
        'readerApp.online.comics.service',
        'readerApp.service.externalView'
    ]).config(ComicsRoute);

    ComicsRoute.$inject = ['$routeProvider'];

    function ComicsRoute($routeProvider) {
        $routeProvider
            .when('/online/comics', {
                templateUrl: 'app/js/online/comics/comics.tpl.html',
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