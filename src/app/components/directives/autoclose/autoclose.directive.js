(function() {
    'use strict';

    angular.module('readerApp.directive.autoclose', [])
    .directive('autoclose', autoclose);

    autoclose.$inject = ['$document'];
    function autoclose($document) {
        return {
            restrict: 'A',
            scope: {},
            link: function (scope, elem) {
                var body = angular.element($document[0].body);
                elem.bind('click', function () {
                    return (body.hasClass('-menu-open')) ? (body.removeClass('-menu-open'), scope.$apply()) : angular.noop;
                });
            }
        };
    }
})();