/**
 * @description
 * Directive for creating chapter list item links in external view.
 */

(function() {
    'use strict';

    var chapterListModule = angular.module('readerApp.directive.chapterList', []);

    chapterListModule.controller('chapterListController', chapterListController);

    chapterListController.$inject = ['$compile', '$scope', '$templateRequest'];
    function chapterListController($compile, $scope, $templateRequest) {
        var chapters = [];

        this.onClick = $scope.onClick || angular.noop;

        /**
         * @description
         * Extract chapters from the current model.
         *
         * @param  {Array}  | chapters - array of chapters.
         * @param  {Object} | elem - DOM wrapper element.
         * @public
         */
        this.extractModel = function (data, elem) {
            chapters = [];
            angular.forEach(data, function (chapter) {
                chapters.push(chapter);
            });

            _appendItems(elem);
        };

        /**
         * @description
         * Append items to DOM wrapper element.
         *
         * @param  {Object} | elem - DOM wrapper element.
         * @private
         */
        function _appendItems (elem) {
            var wrapper = angular.element(elem);

            wrapper.children().remove();
            angular.forEach(chapters, function (chapter, index) {
                var tpl = angular.element('<dd class="list-item" ng-click="clctrl.onClick({index:' + index + ', chapterId: ' + chapter.chapterId + '})">' +
                                    '<a href="javascript:void(0)">' + chapter.chapterId + '</a>' +
                                '</dd>');

                var compiled = $compile(tpl)($scope);
                wrapper.append(compiled);
            });
        }
    }

    chapterListModule.directive('chapterList', chapterList);

    chapterList.$inject = [];
    function chapterList() {
        return {
            replace: true,
            restrict: 'E',
            require: ['^chapterList', 'ngModel'],
            scope: {
                model: '=ngModel',
                onClick: '&'
            },
            controller: 'chapterListController',
            controllerAs: 'clctrl',
            template: '<dl class="sr-list"></dl>',
            compile: function compile() {
                return {
                    post: function (scope, elem, attrs, ctrl) {
                        ctrl = ctrl[0];
                        scope.$watch(function () {
                            return scope.model;
                        }, function (val) {
                            if (val) {
                                ctrl.extractModel(val.chapters, elem);
                            }
                        });

                        scope.$on('$destroy', function () {
                            elem.off();
                        });
                    }
                };
            }
        };
    }
})();