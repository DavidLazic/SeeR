/**
 * @description
 * Directive for showing custom view data outside of "ng-view".
 * Content url gets set by the currently active ng-view controller.
 */

(function () {
    'use strict';

    angular.module('readerApp.directive.externalView', [
        'readerApp.config'
    ]).directive('externalView', externalView);

    externalView.$inject = ['$rootScope', 'AppConfig'];
    function externalView($rootScope, AppConfig) {

        return {
            replace: true,
            restrict: 'E',
            template: ''.concat('<div class="col-sm-8 col-md-6 sr-wrapper -wrapper-external-view" ng-class="{ \'active\' : appctrl.modeChosen }">',
                        '<div class="wrapper-content" ng-include src="contentUrl"></div>',
                      '</div>'),
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