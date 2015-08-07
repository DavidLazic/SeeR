(function() {
    'use strict';

    angular.module('readerApp.home.controller', [
        'readerApp.service.viewModifier'
    ]).controller('HomeController', HomeController);

    HomeController.$inject = ['viewModifierService'];
    function HomeController(viewModifierService) {

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
            viewModifierService.setCurrentView({url: 'app/components/templates/view-home.tpl.html'});
        }
    }
})();
