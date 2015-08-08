(function () {
    'use strict';

    angular.module('readerApp.modal', [
        'readerApp.config'
    ]).controller('ModalController', ModalController);

    ModalController.$inject = ['AppConfig', 'data'];
    function ModalController(AppConfig, data) {
        var vm = this;

        // view model
        vm.coverBaseUrl = AppConfig.URL.COVER;
        vm.chapter = [];

        init();

        /**
         * @return void
         */
        function init () {
            _extractImages();
        }

        /**
         * @description
         * Extract images from data object.
         */
        function _extractImages() {
            angular.forEach(data.chapter.images, function (image) {
                var image = _getImageUrl(image[1]);
                vm.chapter.push(image);
            });
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