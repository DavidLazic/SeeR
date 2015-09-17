(function() {
    'use strict';

    var imageSelectModule = angular.module('readerApp.directive.imageSelect', [
        'ui.bootstrap'
    ]);

    imageSelectModule.controller('imageSelectController', imageSelectController);

    imageSelectController.$inject = ['$scope'];
    function imageSelectController($scope){
        var ctrl = this;

        ctrl.isLoading = false;
        ctrl.total = 0;

        /**
         * @description
         * Extra image URL's from selected files.
         *
         * @param  {Array} | $files - selected files.
         * @public
         */
        this.extractURL = function ($files) {
            angular.forEach($files, function ($file) {
                var reader = new FileReader();

                angular.element(reader).bind('load', function (e) {
                    ctrl.items.push(e.target.result);
                    _setLoader($files.length);
                    $scope.$apply();
                });
                reader.readAsDataURL($file);
            });
        };

        this.setTotal = function (total) {
            ctrl.total = total;
        };

        /**
         * @description
         * Show/hide loader.
         *
         * @param {Integer} | max - total number of selected images.
         * @private
         */
        function _setLoader (max) {
            ctrl.isLoading = ($scope.items.length < max);
        }
    }

    imageSelectModule.directive('imageSelect', imageSelect);

    imageSelect.$inject = [];
    function imageSelect() {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                items: '=',
                onSelectError: '&'
            },
            controller: 'imageSelectController',
            controllerAs: 'isctrl',
            templateUrl: 'app/components/directives/image-select/image-select.tpl.html',
            bindToController: {
                items: '=',
                onSelectError: '&'
            }
        };
    }

    imageSelectModule.directive('fileSelect', fileSelect);

    fileSelect.$inject = ['$filter'];
    function fileSelect($filter) {
        return {
            restrict: 'A',
            require: '^imageSelect',
            link: function (scope, elem, attrs, ctrl) {
                elem.bind('change', function () {
                    if (angular.isDefined(elem[0]) && elem[0].files.length) {
                        var files = $filter('fileImage')(elem[0].files);

                        if (files.invalid.length) {
                            ctrl.onSelectError();
                        } else {
                            ctrl.extractURL(files.filtered);
                            ctrl.setTotal(files.filtered.length);
                        }
                    }
                });

                scope.$on('$destroy', function () {
                    elem.off();
                });
            }
        };
    }
})();