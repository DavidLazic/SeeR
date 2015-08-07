(function() {
    'use strict';

    angular.module('readerApp.online.comics.controller', [
        'readerApp.online.comics.service',
        'readerApp.config',
        'readerApp.service.viewModifier'
    ]).controller('ComicsController', ComicsController);

    ComicsController.$inject = ['ComicsService', 'AppConfig', 'viewModifierService'];
    function ComicsController(ComicsService, AppConfig, viewModifierService) {
        var vm = this;

        // view model
        vm.comics = [];
        vm.coverBaseUrl = AppConfig.URL.COVER;
        vm.pagination = viewModifierService.getPaginationConfig();

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
            ComicsService.getSingleComic().then(function (response) {
                viewModifierService.setCurrentItem({item: item});
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
                if (angular.isDefined(comic) && comic.im !== null) {
                    comic.im = _getImageUrl(comic.im);
                    vm.comics.push(comic);
                }
            });
        }

        /**
         * @description
         * Modify comic cover url.
         *
         * @param  {String} | url - API cover url.
         * @return {String}
         */
        function _getImageUrl(url) {
            return  vm.coverBaseUrl + url;
        }
    }
})();
