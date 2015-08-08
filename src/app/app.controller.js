(function () {
    'use strict';

    angular.module('readerApp.app', [
        'readerApp.config',
        'readerApp.appService',
        'readerApp.service.externalView'
    ]).controller('AppController', AppController);

    AppController.$inject = ['$rootScope', '$modal', 'AppConfig', 'AppService', 'externalViewService'];
    function AppController($rootScope, $modal, AppConfig, AppService, externalViewService) {
        var vm = this,
            data = {
                chapter: null
            };

        // view model
        vm.modeChosen = false;
        vm.item = null;

        // events
        vm.onModeChosen = onModeChosen;
        vm.onResetMode = onResetMode;
        vm.onRead = onRead;
        vm.isItemSet = isItemSet;

        init();

        /**
         * @return void
         */
        function init () {
            _onItemChosen();
        }

        /**
         * @description
         * Open modal with specific comic fn.
         *
         * @param {String} | id - chapter id.
         */
        function onRead (id) {
            var chapter = (angular.isDefined(id)) ? id : vm.item.chapters[0][3];

            AppService.getChapterById(chapter).then(function (response) {
                data.chapter = response;
                _onOpen(data);
            });
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
         * Check if item is set.
         *
         * @return {Bool}
         */
        function isItemSet () {
            return vm.item !== null;
        }

        /**
         * @description
         * Open modal with specific chapter id.
         *
         * @param  {Object} | chapter - comic chapter.
         */
        function _onOpen (chapter) {
            var modalInstance = $modal.open({
                keyboard: false,
                backdrop: 'static',
                windowClass: 'ra-modal',
                templateUrl: 'app/js/modal/modal.tpl.html',
                controller: "ModalController",
                size: 'lg',
                controllerAs: 'mctrl',
                resolve: {
                    data: function () {
                        return chapter;
                    }
                }
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