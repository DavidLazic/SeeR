(function() {
    'use strict';

    angular.module('readerApp.modal.api.controller', [
        'readerApp.modal.service'
    ]).controller('ApiModalController', ApiModalController);

    ApiModalController.$inject = ['$modalInstance', 'ModalService'];
    function ApiModalController($modalInstance, ModalService) {
        var vm = this;

        // vm model
        vm.host = 'READER';

        // events
        vm.onSwitch = onSwitch;
        vm.onClose = onClose;

        function onSwitch () {

        }

        function onClose () {
            $modal.dismiss();
        }
    }
})();