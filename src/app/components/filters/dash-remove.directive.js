(function() {
    'use strict';

    var dashRemoveModule = angular.module('readerApp.filter.dashRemove', []);

    dashRemoveModule.filter('dashRemove', function () {

        /**
         * @description
         * Replace all dashes with blank space.
         *
         * @param  {Array} | data - array of authors/artists.
         * @return {Array}
         */
        return function (data) {
            if (angular.isDefined(data) && angular.isArray(data)) {
                var filtered = [];
                angular.forEach(data, function (item) {
                    filtered.push(item.replace(/-/g, ' '));
                });
                return filtered;
            }
        };
    });
})();