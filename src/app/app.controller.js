(function () {
    'use strict';

    angular.module('readerApp.app', [
        'readerApp.config',
        'readerApp.service.viewModifier'
    ]).controller('AppController', AppController);

    AppController.$inject = ['$rootScope', 'AppConfig', 'viewModifierService'];
    function AppController($rootScope, AppConfig, viewModifierService) {
        var vm = this;

        // view model
        vm.modeChosen = false;
        vm.item = null;

        // events
        vm.onModeChosen = onModeChosen;
        vm.onResetMode = onResetMode;

        init();

        /**
         * @return void
         */
        function init () {
            _onItemChosen();
        }

        /**
         * @description
         * On mode chosen fn.
         */
        function onModeChosen () {
            vm.modeChosen = !vm.modeChosen;
            viewModifierService.setModeChosen({modeChosen: true});
        }

        /**
         * @description
         * On reset mode fn.
         */
        function onResetMode () {
            vm.modeChosen = false;
            viewModifierService.setModeChosen({modeChosen: false});
        }

        /**
         * @description
         * On current item set fn.
         */
        function _onItemChosen () {
            $rootScope.$on(AppConfig.BROADCAST.ITEM_CHOSEN, function (event, data) {
                if (angular.isDefined(data)) {
                    vm.item = data.item;
                }
            });
        }
    }
})();