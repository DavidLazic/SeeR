(function () {
    'use strict';

    angular.module('readerApp.app', [
        'readerApp.config',
        'readerApp.appService',
        'readerApp.service.externalView'
    ]).controller('AppController', AppController);

    AppController.$inject = ['$rootScope', '$modal', 'AppConfig', 'AppService', 'ExternalViewService'];
    function AppController($rootScope, $modal, AppConfig, AppService, externalViewService) {
        var vm = this,
            data = {
                chapterIndex: 0,
                chapters: [],
                currentChapter: null
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
         * @param {String} | idx - chapter index.
         */
        function onRead (id, idx) {
            var chapter = (angular.isDefined(id)) ? id : vm.item.chapters[0][3],
                index = idx || 0;

            _setChapterIndex(index);
            _setAllChapters();

            AppService.getChapterById(chapter).then(function (response) {
                data.currentChapter = response;
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
         * Open modal with specific chapter id and prefetch next chapter.
         *
         * @param  {Object} | data - comic config object.
         */
        function _onOpen (data) {
            $modal.open({
                backdrop: 'static',
                windowClass: 'ra-modal',
                templateUrl: 'app/js/modal/modal.tpl.html',
                controller: "ModalController",
                controllerAs: 'mctrl',
                size: 'lg',
                resolve: {
                    data: function () {
                        return data;
                    }
                }
            });
        }

        /**
         * @description
         * Set all chapters to data chapters array.
         */
        function _setAllChapters () {
            angular.forEach(vm.item.chapters, function (chapter) {
                data.chapters.push(chapter[3]);
            });
        }

        /**
         * @description
         * Set current chapter index.
         *
         * @param {Integer} | idx - current chapter index.
         */
        function _setChapterIndex (idx) {
            data.chapterIndex = idx;
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