(function () {
    'use strict';

    angular.module('readerApp.directive.viewer', [])
    .directive('viewer', viewer);

    viewer.$inject = ['$rootScope'];
    function viewer($rootScope) {

        return {
            replace: true,
            restrict: 'E',
            template: '<div class="asdf" ng-class="{ \'active\' : appctrl.modeChosen }" style="position: absolute; top:0; bottom: 0; left: 50%; width: 700px; margin-left: -350px; background-color: red">' +
                        '<div ng-include="contentUrl"></div>' +
                      '</div>',
            link: function (scope) {
                $rootScope.$on('view:changed', function (event, data) {
                    if (data) {
                        scope.contentUrl = data.url;
                    }
                });
            }
        };
    }
})();