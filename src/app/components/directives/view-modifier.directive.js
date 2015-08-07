/**
 * @description
 * Directive for showing custom view data outside of "ng-view".
 * Content url gets set by the currently active ng-view controller.
 */

(function () {
    'use strict';

    angular.module('readerApp.directive.viewer', [
        'readerApp.config'
    ]).directive('viewer', viewer);

    viewer.$inject = ['$rootScope', 'AppConfig'];
    function viewer($rootScope, AppConfig) {

        return {
            replace: true,
            restrict: 'E',
            template: '<div class="asdf" ng-class="{ \'active\' : appctrl.modeChosen }" style="position: absolute; top:0; bottom: 0; left: 50%; width: 700px; margin-left: -350px; background-color: red">' +
                        '<div ng-include="contentUrl"></div>' +
                      '</div>',
            link: function (scope) {
                $rootScope.$on(AppConfig.BROADCAST.VIEW_CHANGED, function (event, data) {
                    if (angular.isDefined(data)) {
                        scope.contentUrl = data.url;
                    }
                });
            }
        };
    }
})();