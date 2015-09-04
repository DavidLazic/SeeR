(function() {
    'use strict';

    var dashRemoveModule = angular.module('readerApp.filter.dashRemove', []);

    dashRemoveModule.filter('dashRemove', function () {

        /**
         * @description
         * Replace all dashes with blank space.
         *
         * @param  {Array} | input - array of authors/artists.
         * @return {Array}
         */
        return function (input) {
            if (angular.isDefined(input) && angular.isArray(input)) {
                var authors = [];
                angular.forEach(input, function (author) {
                    if (angular.isDefined (author)) {
                        authors.push(author.replace(/-/g, ' '));
                    }
                });
                return authors;
            }
        };
    });
})();