(function() {
    'use strict';

    angular.module('readerApp.directive.switcher', [])
    .directive('switcher', switcher);

    switcher.$inject = [];
    function switcher() {
        return {
            replace: true,
            require: 'ngModel',
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            templateUrl: 'app/components/directives/switcher/switcher.tpl.html',
            link: function (scope, elem, attrs, ngModel) {

                scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (val) {
                    scope.isChecked = _isActive(val);
                });

                /**
                 * @description
                 * Check which host is currently active.
                 *
                 * @param  {String} | hostName - current host name.
                 * @return {Bool}
                 * @private
                 */
                function _isActive (hostName) {
                    return hostName !== 'READER';
                }

                /**
                 * @description
                 * On toggle fn.
                 *
                 * @return {Function}
                 * @private
                 */
                function _onToggle () {
                    scope.$apply(function () {
                        if (angular.isDefined(attrs.onChange)) {
                            scope.onChange();
                        }
                    });
                }

                elem.on('click', _onToggle);

                scope.$on('$destroy', function () {
                    elem.off();
                });

            }
        };
    }
})();