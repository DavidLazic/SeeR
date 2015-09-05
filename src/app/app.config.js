(function () {
    'use strict';

    var appConfig = angular.module('readerApp.config', []);

    appConfig.constant('AppConfig', {
        HOST: {
            READER: {
                LIST: '/mangareader.net/',
                COMIC_BY_ID: '/mangareader.net/manga/',
                COVER: '/mangareader.net/manga/'
            },
            FOX: {
                LIST: '/mangafox.me/',
                COMIC_BY_ID: '/mangafox.me/manga/',
                COVER: '/mangafox.net/manga/'
            },
            STREAM: {}
        },
        URL: {
            BASE: 'https://doodle-manga-scraper.p.mashape.com'
        },
        ROUTE: {
            DEFAULT: '/'
        },
        HEADER: {
            COMMON: 'X-Requested-With',
            MASH_KEY: 'PSIRi8Do3mmshyfYAvbND6cGn9H8p18k6N9jsnrdh8edj21ijr',
            ACCEPT: 'text/plain'
        },
        BROADCAST: {
            VIEW_CHANGED: 'view:changed',
            MODE_CHOSEN: 'mode:chosen',
            ITEM_CHOSEN: 'item:chosen',
            ITEM_RESET: 'item:reset',
            ITEM_CHECK: 'item:check',
            ITEM_RETRIEVE: 'item:retrieve'
        }
    });
})();