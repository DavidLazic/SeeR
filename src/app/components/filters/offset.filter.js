(function() {
    'use strict';

    var offsetFilter = angular.module('readerApp.filter.offset', []);

    offsetFilter.filter('offset', function () {
        /**
         * @description
         * Paginate all comics array.
         *
         * @param  {Array}  | input - all comics array.
         * @param  {Object} | params - config object (offset, limit).
         * @return {Array}
         */
        return function (input, params) {
            if (angular.isDefined(input) && angular.isArray(input)) {
                var sliceStart = --params.offset * params.limit,
                    sliceEnd = sliceStart + params.limit;
                return input.slice(sliceStart, sliceEnd);
            }
        };
    });
})();