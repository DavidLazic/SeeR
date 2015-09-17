(function() {
    'use strict';

    var fileImageModule = angular.module('readerApp.filter.fileImage', []);

    fileImageModule.filter('fileImage', function () {

        /**
         * @description
         * Filter only images from selected files.
         *
         * @param  {Array} | files - array of selected files.
         * @return {Object} {<filtered>: [], <invalid>: []}
         */
        return function (files) {
            if (angular.isDefined(files) && angular.isObject(files)) {
                var results = {
                    filtered: [],
                    invalid: []
                };
                angular.forEach(files, function (file) {
                    if (['image/jpeg', 'image/png'].indexOf(file.type) !== -1) {
                        results.filtered.push(file);
                    } else {
                        results.invalid.push(file);
                    }
                });
                return results;
            }
        };
    });
})();