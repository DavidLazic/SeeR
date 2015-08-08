(function () {
    'use strict';

    angular.module('readerApp.app', [
        'readerApp.config',
        'readerApp.service.externalView'
    ]).controller('AppController', AppController);

    AppController.$inject = ['$rootScope', 'AppConfig', 'externalViewService'];
    function AppController($rootScope, AppConfig, externalViewService) {
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
            externalViewService.setModeChosen({modeChosen: true});
        }

        /**
         * @description
         * On reset mode fn.
         */
        function onResetMode () {
            vm.modeChosen = false;
            vm.item = null;
            externalViewService.setModeChosen({
                url: null,
                modeChosen: false,
                item: null
            });
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