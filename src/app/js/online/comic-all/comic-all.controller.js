(function() {
    'use strict';

    angular.module('readerApp.online.comicAll.controller', [
        'readerApp.online.comicAll.service',
        'readerApp.config'
    ]).controller('ComicAllController', ComicAllController);

    ComicAllController.$inject = ['ComicAllService', 'AppConfig'];
    function ComicAllController(ComicAllService, AppConfig) {
        var vm = this;

        // view model
        vm.comics = [];
        vm.coverBaseUrl = AppConfig.URL.COVER;
        vm.pagination = {
            limit: 30,
            offset: 1,
            offsetStart: 0,
            totalCount: 0,
            maxSize: 5
        };

        // events
        vm.onSearch = onSearch;

        init();

        /**
         * @return void
         */
        function init() {
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
         * Get all comics and paginate them.
         */
        function _getAllComics() {
            ComicAllService.getAllComics().then(_setVM);

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
