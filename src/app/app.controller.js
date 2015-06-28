(function () {
    'use strict';

    angular.module('readerApp.app', [
        'readerApp.config'
    ]).controller('AppController', AppController);

    AppController.$inject = ['AppConfig'];
    function AppController (AppConfig) {
        var vm = this;
        console.log('AppController');
    }
})();