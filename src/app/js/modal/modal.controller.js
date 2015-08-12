(function () {
    'use strict';

    angular.module('readerApp.modal.controller', [
        'readerApp.config',
        'readerApp.modal.service'
    ]).controller('ModalController', ModalController);

    ModalController.$inject = ['$modalInstance', 'AppConfig', 'ModalService', 'data'];
    function ModalController($modalInstance, AppConfig, ModalService, data) {
        var vm = this;

        // view model
        vm.coverBaseUrl = AppConfig.URL.COVER;
        vm.chapter = [];
        vm.nextChapter = null;

        // events
        vm.onCancel = onCancel;

        init();

        /**
         * @return void
         */
        function init () {
            _prefetchNextChapter();
            _extractImages();
        }

        /**
         * @description
         * Cancel modal.
         */
        function onCancel () {
            $modalInstance.dismiss('cancel');
        }

        /**
         * @description
         * Extract images from data object.
         */
        function _extractImages() {
            angular.forEach(data.currentChapter.images, function (imageItem) {
                var image = _getImageUrl(imageItem[1]);
                vm.chapter.push(image);
            });
        }

        /**
         * @description
         * Prefetch next comic chapter by id.
         */
        function _prefetchNextChapter () {
            var nextChapterIdx = ++data.chapterIndex;
            if (angular.isDefined(data.chapters[nextChapterIdx])) {
                ModalService.getNextChapter(data.chapters[nextChapterIdx]).then(function (response) {
                    vm.nextChapter = response;
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