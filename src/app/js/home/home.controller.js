(function() {
    'use strict';

    angular.module('readerApp.home.controller', [
        'readerApp.home.service'
    ]).controller('HomeController', HomeController);

    HomeController.$inject = ['HomeService'];
    function HomeController(HomeService) {

        init();

        /**
         * @return void
         */
        function init() {
            _setCurrentView();
        }

        /**
         * @description
         * Set custom view on the outside scope of ng-view.
         */
        function _setCurrentView () {
            HomeService.setCurrentView({url: 'app/components/templates/view-home.tpl.html'});
        }
    }
})();
