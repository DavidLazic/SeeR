(function () {
    'use strict';

    angular.module('readerApp.modal.controller', [
        'readerApp.modal.service'
    ]).controller('ModalController', ModalController);

    ModalController.$inject = ['$scope', '$modalInstance', 'ModalService', 'data'];
    function ModalController($scope, $modalInstance, ModalService, chapter) {
        var vm = this,
            data = angular.copy(chapter) || {name: null, chapterIndex: 0, chapters: [], currentChapter: {images: []}};

        // view model
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

        /**
         * @description
         * Prepare model.
         */
        function _prepareModel () {
            vm.model.total = data.currentChapter.pages.length - 1;
            vm.model.totalChapters = data.chapters.length - 1;
            _prefetchPreviousChapter();
            _prefetchNextChapter();
            _extractImages(data.currentChapter.pages, 'chapter');
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
                vm.model[vmProperty].push(imageItem.url);
            });
        }

        /**
         * @description
         * Prefetch previous comic chapter by id.
         */
        function _prefetchPreviousChapter () {
            var prevChapterIdx = data.chapterIndex - 1;
            if (angular.isDefined(data.chapters[prevChapterIdx])) {
                ModalService.getChapterById({comic: data.name, chapterId: data.chapters[prevChapterIdx]}).then(function (response) {
                    _extractImages(response.pages, 'previousChapter');
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
                ModalService.getChapterById({comic: data.name, chapterId: data.chapters[nextChapterIdx]}).then(function (response) {
                    _extractImages(response.pages, 'nextChapter');
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
    }
})();