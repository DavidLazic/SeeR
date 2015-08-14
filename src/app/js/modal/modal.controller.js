(function () {
    'use strict';

    angular.module('readerApp.modal.controller', [
        'readerApp.config',
        'readerApp.modal.service'
    ]).controller('ModalController', ModalController);

    ModalController.$inject = ['$scope', '$modalInstance', 'AppConfig', 'ModalService', 'data'];
    function ModalController($scope, $modalInstance, AppConfig, ModalService, data) {
        var vm = this;

        // view model
        vm.coverBaseUrl = AppConfig.URL.COVER;
        vm.model = {
           previousChapter: [],
           chapter: [],
           nextChapter: []
        };

        // events
        vm.onCancel = onCancel;
        vm.onPrev = onPrev;
        vm.onNext = onNext;

        init();

        /**
         * @return void
         */
        function init () {
            _prefetchPreviousChapter();
            _prefetchNextChapter();
            _extractImages(data.currentChapter.images, 'chapter');
        }

        function onPrev () {
            --data.chapterIndex;
            _prefetchPreviousChapter();
        }

        function onNext () {
            ++data.chapterIndex;
            _prefetchNextChapter();
        }

        /**
         * @description
         * Cancel modal.
         */
        function onCancel () {
            $modalInstance.close();
        }

        /**
         * @description
         * Extract images from data object.
         *
         * @param {String} | data - data object.
         * @param {String} | vmProperty - model object property.
         */
        function _extractImages (data, vmProperty) {
            vm.model[vmProperty].length = 0;

            angular.forEach(data, function (imageItem) {
                var image = _getImageUrl(imageItem[1]);
                vm.model[vmProperty].push(image);
            });

            vm.model[vmProperty].reverse();
        }

        /**
         * @description
         * Prefetch previous comic chapter by id.
         */
        function _prefetchPreviousChapter () {
            var prevChapterIdx = data.chapterIndex - 1;
            if (angular.isDefined(data.chapters[prevChapterIdx])) {
                ModalService.getChapterById(data.chapters[prevChapterIdx]).then(function (response) {
                    _extractImages(response.images, 'previousChapter');
                });
            }
        }

        /**
         * @description
         * Prefetch next comic chapter by id.
         */
        function _prefetchNextChapter () {
            var nextChapterIdx = data.chapterIndex + 1;
            if (angular.isDefined(data.chapters[nextChapterIdx])) {
                ModalService.getChapterById(data.chapters[nextChapterIdx]).then(function (response) {
                    _extractImages(response.images, 'nextChapter');
                });
            }
        }

        /**
         * @description
         * Get image full url.
         *
         * @param  {String} | url - image url.
         * @return {String}
         */
        function _getImageUrl (url) {
            return vm.coverBaseUrl + url;
        }
    }
})();