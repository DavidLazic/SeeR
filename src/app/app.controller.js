(function () {
    'use strict';

    angular.module('readerApp.app', [])
    .controller('AppController', AppController);

    AppController.$inject = [];
    function AppController () {
        var vm = this;

        // view model
        vm.modeChosen = false;

        // events
        vm.onModeChosen = onModeChosen;

        /**
         * @description
         * Mode chosen.
         */
        function onModeChosen () {
            vm.modeChosen = !vm.modeChosen;
        }
    }
})();