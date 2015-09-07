(function() {
    'use strict';

    angular.module('readerApp.modal.api.controller', [])
    .controller('ApiModalController', ApiModalController);

    ApiModalController.$inject = ['$modalInstance', 'data'];
    function ApiModalController($modalInstance, host) {
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

        function getFullHostName () {
            return hostValue[vm.host.name].fullName;
        }

        function _isActive (hostName) {
            return hostConfig.name === hostName;
        }

        function onSwitch () {
            angular.forEach(hostValue, function (item) {
                item.active = !item.active;
                if (item.active) {
                    vm.host.name = item.name;
                }
            });
        }

        function onApply () {
            $modalInstance.close(vm.host);
        }

        function onCancel () {
            $modalInstance.dismiss('cancel');
        }
    }
})();