(function() {
    'use strict';

    angular.module('readerApp.directive.switcher', [])
    .directive('switcher', switcher);

    switcher.$inject = [];
    function switcher() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            templateUrl: '/app/components/directives/switcher/switcher.tpl.html',
            link: function (scope, elem, attrs) {
                scope.isChecked = false;

                function onToggleClick () {
                    scope.$apply(function () {
                        scope.isChecked = !scope.isChecked;
                        if (angular.isDefined(attrs.onChange)) {
                            scope.onChange();
                        }
                    });
                }

                elem.on('click', onToggleClick);

                scope.$on('$destroy', function () {
                    elem.off();
                });

            }
        };
    }
})();