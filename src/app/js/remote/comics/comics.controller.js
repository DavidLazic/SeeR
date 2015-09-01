(function() {
    'use strict';

    angular.module('readerApp.remote.comics.controller', [
        'readerApp.remote.comics.service'
    ]).controller('ComicsController', ComicsController);

    ComicsController.$inject = ['ComicsService'];
    function ComicsController(ComicsService) {
        var vm = this;

        // view model
        vm.comics = [];
        vm.pagination = ComicsService.getPaginationConfig();
        vm.query = '';

        // events
        vm.onSearch = onSearch;
        vm.onOpen = onOpen;
        vm.isPaginationEnd = isPaginationEnd;
        vm.onClear = onClear;

        init();

        /**
         * @return void
         */
        function init() {
            _setCurrentView();
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
            ComicsService.getSingleComic(item.mangaId).then(function (response) {
                ComicsService.setCurrentItem({item: response});
            });
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
        function _setCurrentView () {
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
