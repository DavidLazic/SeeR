(function() {
    'use strict';

    angular.module('readerApp.home.controller', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope'];
    function HomeController($rootScope) {

        init();

        function init () {

        }
    }
})();
