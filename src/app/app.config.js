(function () {
    'use strict';

    var appConfig = angular.module('readerApp.config', []);

    appConfig.constant('AppConfig', {
        URL: {
            ALL_COMICS: 'https://www.mangaeden.com/api/list/0',
            COMIC_BY_ID: 'https://www.mangaeden.com/api/manga/',
            CHAPTER_BY_ID: 'https://www.mangaeden.com/api/chapter/',
            COVER: 'http://cdn.mangaeden.com/mangasimg/'
        },
        ROUTE: {
            DEFAULT: '/'
        },
        HEADER: {
            COMMON: 'X-Requested-With'
        },
        BROADCAST: {
            VIEW_CHANGED: 'view:changed',
            MODE_CHOSEN: 'mode:chosen',
            ITEM_CHOSEN: 'item:chosen'
        }
    });
})();