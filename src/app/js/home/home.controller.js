(function() {
    'use strict';

    angular.module('readerApp.home.controller', [
        'readerApp.home.service'
    ]).controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', 'HomeService'];
    function HomeController ($rootScope, HomeService) {

        init();

        function init () {
            if(!angular.isDefined($rootScope.cache.allComics)){
                HomeService.getAllComics().then(function (data) {
                    $rootScope.cache.allComics = data;
                });
            }
        }
    }
})();
