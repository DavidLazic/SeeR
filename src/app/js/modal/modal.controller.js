(function () {
    'use strict';

    angular.module('readerApp.modal.controller', [
        'readerApp.config',
        'readerApp.modal.service'
    ]).controller('ModalController', ModalController);

    ModalController.$inject = ['$scope', '$modalInstance', 'AppConfig', 'ModalService', 'data'];
    function ModalController($scope, $modalInstance, AppConfig, ModalService, chapter) {
        var vm = this,
            data = angular.copy(chapter) || {chapterIndex: 0, chapters: [], currentChapter: {images: []}};

        // view model
        vm.coverBaseUrl = AppConfig.URL.COVER;
        vm.model = {
            chapterIdx: 0,
            index: 0,
            total: 0,
            totalChapters: 0,
            previousChapter: [],
            chapter: [],
            nextChapter: [],
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
            _updateChapterIndex();
            _prepareModel();
        }

        function _prepareModel () {
            vm.model.total = data.currentChapter.images.length - 1;
            vm.model.totalChapters = data.chapters.length -1;
            _prefetchPreviousChapter();
            _prefetchNextChapter();
            _extractImages(data.currentChapter.images, 'chapter');
        }

        /**
         * @description
         * On previous previous chapter fn.
         */
        function onPrev () {
            --data.chapterIndex;
            _prefetchPreviousChapter();
            _updateChapterIndex();
            _updateTotal();
        }

        /**
         * @description
         * On next chapter fn.
         */
        function onNext () {
            ++data.chapterIndex;
            _prefetchNextChapter();
            _updateChapterIndex();
            _updateTotal();
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
         * Update total chapter length.
         */
        function _updateTotal() {
            vm.model.total = vm.model.chapter.length - 1;
        }

        /**
         * @description
         * Update current chapter index.
         */
        function _updateChapterIndex () {
            vm.model.chapterIdx = data.chapterIndex;
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