(function() {
    'use strict';

    angular.module('readerApp.online.comicAll.controller', [
        'readerApp.online.comicAll.service',
        'readerApp.config'
    ]).controller('ComicAllController', ComicAllController);

    ComicAllController.$inject = ['$rootScope', 'ComicAllService', 'AppConfig'];
    function ComicAllController ($rootScope, ComicAllService, AppConfig) {
        var vm = this;

        // view model
        vm.allComics = $rootScope.cache.allComics || [];
        vm.pagination = {
            currentOffset: 0,
            paginatedComics: [],
        };
        vm.coverUrl = AppConfig.URL.COVER;

        init();

        function init () {
            angular.forEach(vm.allComics.manga, function (item, idx) {
                if (idx <= 30) vm.pagination.paginatedComics.push(item);
            });
            // for (var i = 0; i <= 30; i++) {
                // vm.pagination.paginatedComics.push(vm.allComics.manga[i]);
            // }
        }

        function onOffsetChange (offset) {
            vm.pagination.currentOffset = offset;
        }
    }
})();
