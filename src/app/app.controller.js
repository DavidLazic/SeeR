(function () {
    'use strict';

    angular.module('readerApp.app', [
        'ui.bootstrap',
        'readerApp.config',
        'readerApp.appService',
        'readerApp.service.utility'
    ]).controller('AppController', AppController);

    AppController.$inject = ['$http', '$scope', '$rootScope', '$modal', '$filter', 'AppConfig', 'AppService', 'UtilityService', 'notificationMessage'];
    function AppController($http, $scope, $rootScope, $modal, $filter, AppConfig, AppService, UtilityService) {
        var vm = this,
            data = AppService.getDataConfig(),
            hostName = 'READER'; // default API

        // view model
        vm.modeChosen = false;
        vm.item = null;

        // events
        vm.onModeChosen = onModeChosen;
        vm.onResetMode = onResetMode;
        vm.onRead = onRead;
        vm.onSwitch = onSwitch;
        vm.isItemSet = isItemSet;
        vm.setHostValue = setHostValue;

        init();

        /**
         * @return void
         */
        function init () {
            setHostValue(hostName);
            _bindOnItemChosen();
            _bindOnItemCheck();
        }

        /**
         * @description
         * Set global host value.
         *
         * @param {String} | hostName - chosen host value.
         * @public
         */
        function setHostValue (hostName) {
            UtilityService.setHostValue(hostName);
        }

        /**
         * @description
         * Open modal with specific comic fn.
         *
         * @param {Object} | comic - comic object. ({name: <name>, id: <id>, index: <index>})
         * @public
         */
        function onRead (comic) {
            var chapter = (angular.isDefined(comic.id)) ? comic.id : vm.item.chapters[0].chapterId,
                index = comic.index || 0;

            _setChapterIndex(comic.name, index);
            _setAllChapters();

            AppService.getChapterById({comic: comic.name, chapterId: chapter}).then(function (response) {
                data.currentChapter = response;
                data.name = vm.item.name;
                _onOpen(data);
            });
        }

        /**
         * @description
         * Open modal for API switching.
         *
         * @return {Object}
         * @public
         */
        function onSwitch () {
            var host = {
                name: hostName
            };

            onResetMode();
            var modalInstance = $modal.open({
                backdrop: false,
                keyboard: false,
                windowClass: 'sr-modal -modal-switch',
                templateUrl: 'app/js/modal/api/api.tpl.html',
                controller: "ApiModalController",
                controllerAs: 'amctrl',
                size: 'lg',
                resolve: {
                    data: function () {
                        return host;
                    }
                }
            });

            modalInstance.result.then(function (host) {
                hostName = host.name;
                setHostValue(hostName);
            });
        }

        /**
         * @description
         * On mode chosen fn.
         *
         * @param {String} | modeType - mode type.
         * @return {Function}
         * @public
         */
        function onModeChosen (modeType) {
            if (angular.isDefined(modeType)) {
                return (modeType === 'remote') ? _remoteMode() : _localMode();
            }
        }

        /**
         * @description
         * On remote mode chosen.
         *
         * @private
         */
        function _remoteMode () {
            vm.modeChosen = !vm.modeChosen;
            UtilityService.setModeChosen({modeChosen: true});
            setHostValue(hostName);
        }

        /**
         * @description
         * On local mode chosen.
         *
         * @private
         */
        function _localMode () {
            var modalInstance = $modal.open({
                backdrop: false,
                keyboard: false,
                windowClass: 'sr-modal -modal-switch',
                templateUrl: 'app/js/modal/select/select.tpl.html',
                controller: "SelectModalController",
                controllerAs: 'smctrl',
                size: 'lg'
            });

            modalInstance.result.then(function ($files) {
                _onOpen({
                    local: true,
                    chapterIndex: 0,
                    chapters: [],
                    currentChapter: {
                        pages: $files
                    }
                });
            });
        }

        /**
         * @description
         * On reset mode fn.
         *
         * @public
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
         * @public
         */
        function isItemSet () {
            return vm.item !== null;
        }

        /**
         * @description
         * Open modal with specific chapter id and prefetch next chapter.
         *
         * @param  {Object} | data - comic config object.
         * @private
         */
        function _onOpen (data) {
            var modalInstance = $modal.open({
                backdrop: false,
                keyboard: false,
                windowClass: 'sr-modal -modal-reader',
                templateUrl: 'app/js/modal/reader/reader.tpl.html',
                controller: "ReaderModalController",
                controllerAs: 'rmctrl',
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
         *
         * @private
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
         * @private
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
         *
         * @private
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