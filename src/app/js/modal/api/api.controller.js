(function() {
    'use strict';

    angular.module('readerApp.modal.api.controller', [
        'readerApp.modal.service'
    ]).controller('ApiModalController', ApiModalController);

    ApiModalController.$inject = ['$modalInstance', 'ModalService', 'data'];
    function ApiModalController($modalInstance, ModalService, host) {
        var vm = this,
            hostConfig = angular.copy(host) || {name: ''},
            hostValue = {
                READER: {
                    fullName: 'Mangareader.net',
                    name: 'READER',
                    active: _isActive('READER')
                },
                FOX: {
                    fullName: 'Mangafox.me',
                    name: 'FOX',
                    active: _isActive('FOX')
                }
            };

        // view model
        vm.host = hostConfig;

        // events
        vm.onSwitch = onSwitch;
        vm.onApply = onApply;
        vm.onCancel = onCancel;
        vm.getFullHostName = getFullHostName;

        /**
         * @description
         * On switch host selection fn.
         *
         * @return {String}
         * @public
         */
        function onSwitch () {
            angular.forEach(hostValue, function (item) {
                item.active = !item.active;
                if (item.active) {
                    vm.host.name = item.name;
                }
            });
        }

        /**
         * @description
         * On apply host selection fn.
         *
         * @return {Object}
         * @public
         */
        function onApply () {
            ModalService.sendNotification('Server successfully changed.', 'success').then(function () {
                $modalInstance.close(vm.host);
            });
        }

        /**
         * @description
         * On cancel modal fn.
         *
         * @return void
         * @public
         */
        function onCancel () {
            $modalInstance.dismiss('cancel');
        }

        /**
         * @description
         * Get full host name.
         *
         * @return {String}
         * @public
         */
        function getFullHostName () {
            return hostValue[vm.host.name].fullName;
        }

        /**
         * @description
         * Check which host is currently active.
         *
         * @param  {String} | hostName - current host name.
         * @return {Bool}
         * @private
         */
        function _isActive (hostName) {
            return hostConfig.name === hostName;
        }
    }
})();