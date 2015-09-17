(function() {
    'use strict';

    angular.module('readerApp.modal.select.controller', [
        'readerApp.modal.service'
    ]).controller('SelectModalController', SelectModalController);

    SelectModalController.$inject = ['$modalInstance', 'ModalService'];
    function SelectModalController($modalInstance, ModalService) {
        var vm = this;

        // view model
        vm.files = [];

        // events
        vm.onApply = onApply;
        vm.onCancel = onCancel;
        vm.onSelectError = onSelectError;

        /**
         * @description
         * On selection error fn.
         *
         * @return {Object}
         * @public
         */
        function onSelectError () {
            ModalService.sendNotification('Please select JPEG or PNG type only.', 'error');
        }

        /**
         * @description
         * On apply files selection fn.
         *
         * @return {Object}
         * @public
         */
        function onApply () {
            $modalInstance.close(vm.files);
        }

        /**
         * @description
         * On cancel modal fn.
         *
         * @return void
         * @public
         */
        function onCancel () {
            $modalInstance.dismiss('close');
        }
    }
})();