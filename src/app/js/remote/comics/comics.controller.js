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

        // events
        vm.onSearch = onSearch;
        vm.onOpen = onOpen;

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
