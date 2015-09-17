(function () {
    'use strict';

    angular.module('readerApp.modal.reader.controller', [
        'readerApp.modal.service'
    ]).controller('ReaderModalController', ReaderModalController);

    ReaderModalController.$inject = ['$modalInstance', 'ModalService', 'data'];
    function ReaderModalController($modalInstance, ModalService, chapter) {
        var vm = this,
            data = angular.copy(chapter) || {name: null, chapterIndex: 0, chapters: [], currentChapter: {pages: []}};

        // view model
        vm.model = {
            name: '',
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
            ModalService.sendNotification('You can use left and right arrow keys to navigate.', 'info');
            _updateChapterIndex();
            _prepareModel();
        }

        /**
         * @description
         * Prepare model.
         *
         * @private
         */
        function _prepareModel () {
            vm.model.name = data.name;
            vm.model.total = data.currentChapter.pages.length - 1;
            vm.model.totalChapters = data.chapters.length - 1;
            _prefetchPreviousChapter();
            _prefetchNextChapter();
            return (data.local) ? vm.model.chapter = data.currentChapter.pages : _extractImages(data.currentChapter.pages, 'chapter');
        }

        /**
         * @description
         * On previous previous chapter fn.
         *
         * @public
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
         *
         * @public
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
         *
         * @public
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
         * @private
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
         *
         * @private
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
         *
         * @private
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
         *
         * @private
         */
        function _updateTotal() {
            vm.model.total = vm.model.chapter.length - 1;
        }

        /**
         * @description
         * Update current chapter index.
         *
         * @private
         */
        function _updateChapterIndex () {
            vm.model.chapterIdx = data.chapterIndex;
        }
    }
})();