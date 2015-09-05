(function () {
    'use strict';

    angular.module('readerApp.app', [
        'ui.bootstrap',
        'readerApp.config',
        'readerApp.appService',
        'readerApp.service.utility'
    ]).controller('AppController', AppController);

    AppController.$inject = ['$http', '$scope', '$rootScope', '$modal', '$filter', 'AppConfig', 'AppService', 'UtilityService'];
    function AppController($http, $scope, $rootScope, $modal, $filter, AppConfig, AppService, UtilityService) {
        var vm = this,
            data = AppService.getDataConfig();

        // view model
        vm.modeChosen = false;
        vm.item = null;

        // events
        vm.onModeChosen = onModeChosen;
        vm.onResetMode = onResetMode;
        vm.onRead = onRead;
        vm.isItemSet = isItemSet;
        vm.setHostValue = setHostValue;

        init();

        /**
         * @return void
         */
        function init () {
            setHostValue('READER');
            _bindOnItemChosen();
            _bindOnItemCheck();
            _bindOnItemReset();
        }

        /**
         * @description
         * Set global host value.
         *
         * @param {String} | hostValue - chosen host value.
         */
        function setHostValue (hostValue) {
            UtilityService.setHostValue(hostValue);
        }

        /**
         * @description
         * Open modal with specific comic fn.
         *
         * @param {Object} | comic - comic object. ({name: <name>, id: <id>, index: <index>})
         */
        function onRead (comic) {
            console.log(comic);
            var chapter = (angular.isDefined(comic.id)) ? comic.id : vm.item.chapters[0].chapterId,
                index = comic.index || 0;

            _setChapterIndex(comic.name, index);
            _setAllChapters();

            AppService.getChapterById({comic: comic.name, chapterId: chapter}).then(function (response) {
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
            UtilityService.setModeChosen({modeChosen: true});
        }

        /**
         * @description
         * On reset mode fn.
         */
        function onResetMode () {
            vm.modeChosen = false;
            vm.item = null;
            UtilityService.setModeChosen({
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
            var modalInstance = $modal.open({
                backdrop: false,
                keyboard: false,
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

            modalInstance.result.then(function () {
                data = AppService.getDataConfig();
            });
        }

        /**
         * @description
         * Set all chapters to data chapters array.
         */
        function _setAllChapters () {
            angular.forEach(vm.item.chapters, function (chapter) {
                data.chapters.push(chapter.chapterId);
            });
        }

        /**
         * @description
         * Set current chapter index.
         *
         * @param {String}  | name - comic name.
         * @param {Integer} | idx - current chapter index.
         */
        function _setChapterIndex (name, idx) {
            angular.extend(data, {name: name, chapterIndex: idx});
        }

        /**
         * @description
         * Retrieve item from main app controller.
         *
         * @return {Object}
         * @private
         */
        function _bindOnItemCheck () {
            $rootScope.$on(AppConfig.BROADCAST.ITEM_CHECK, function () {
                $rootScope.$broadcast(AppConfig.BROADCAST.ITEM_RETRIEVE, vm.item);
            });
        }

        /**
         * @description
         * Reset whole item.
         *
         * @private
         */
        function _bindOnItemReset () {
            $rootScope.$on(AppConfig.BROADCAST.ITEM_RESET, function () {
                // vm.item = null;
            });
        }

        /**
         * @description
         * Remove dashes from author/artist item values.
         *
         * @param  {Array} | props - array of item properties to be filtered.
         * @private
         */
        function _removeDashes (props) {
            if (angular.isArray(props)) {
                angular.forEach(props, function (prop) {
                    vm.item[prop] = $filter('dashRemove')(vm.item[prop]);
                });
            }
        }

        /**
         * @description
         * On current item set fn.
         */
        function _bindOnItemChosen () {
            $rootScope.$on(AppConfig.BROADCAST.ITEM_CHOSEN, function (event, data) {
                if (angular.isDefined(data)) {
                    vm.item = data.item;
                    _removeDashes(['author', 'artist']);
                }
            });
        }
    }
})();