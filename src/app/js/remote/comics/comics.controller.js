(function() {
    'use strict';

    angular.module('readerApp.remote.comics.controller', [
        'readerApp.config',
        'readerApp.remote.comics.service'
    ]).controller('ComicsController', ComicsController);

    ComicsController.$inject = ['$rootScope', 'AppConfig', 'ComicsService'];
    function ComicsController($rootScope, AppConfig, ComicsService) {
        var vm = this,
            currentItem = {
                mangaId: ''
            };

        // view model
        vm.comics = [];
        vm.pagination = ComicsService.getPaginationConfig();
        vm.query = '';

        // events
        vm.onSearch = onSearch;
        vm.onOpen = onOpen;
        vm.isPaginationEnd = isPaginationEnd;
        vm.onClear = onClear;
        vm.setCurrentView = setCurrentView;

        init();

        /**
         * @return void
         */
        function init() {
            _bindOnItemRetrive();
            _getAllComics();
        }

        /**
         * @description
         * Set pagination offset to 1 on user search.
         */
        function onSearch() {
            vm.pagination.offset = 1;
        }

        /**
         * @description
         * On open item fn.
         */
        function onOpen (item) {
            ComicsService.checkCurrentItem();
            if (currentItem.mangaId !== item.mangaId) {
                ComicsService.resetItem();
                ComicsService.getSingleComic(item.mangaId).then(function (response) {
                    ComicsService.setCurrentItem({item: response});
                });
            }
        }

        /**
         * @description
         * On clear search query fn.
         */
        function onClear () {
            vm.query = '';
        }

        /**
         * @description
         * Set custom view on the outside scope of ng-view.
         */
        function setCurrentView () {
            ComicsService.setCurrentView({url: 'app/components/templates/view-comic.tpl.html'});
        }

        /**
         * @description
         * Get all comics and paginate them.
         */
        function _getAllComics() {
            ComicsService.getAllComics().then(_setVM);
        }

        /**
         * @description
         * Watcher for the end of pagination.
         *
         * @return {Bool}
         */
        function isPaginationEnd () {
            return (vm.pagination.offset * vm.pagination.limit) >= vm.pagination.totalCount;
        }

        /**
         * @description
         * Retrieve item from main app controller.
         *
         * @private
         */
        function _bindOnItemRetrive () {
            $rootScope.$on(AppConfig.BROADCAST.ITEM_RETRIEVE, function (event, item) {
                if (item !== null) {
                    currentItem = item;
                }
            });
        }

        /**
         * @description
         * Paginate all comics.
         *
         * @param {Object} | data - all comics JSON response.
         */
        function _setVM(data) {
            vm.pagination.totalCount = data.length;
            angular.forEach(data, function (comic) {
                if (angular.isDefined(comic)) {
                    vm.comics.push(comic);
                }
            });
        }
    }
})();
