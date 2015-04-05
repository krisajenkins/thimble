/* @flow weak */

(function () {
    var STARRED_PRODUCTS_KEY = "STARRED_PRODUCTS";

    var getScroll = function () {
        return ((document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100);
    };

    var sendHash = function (event) {
        var hash = document.location.hash;
        app.ports.locationHash.send(hash);
        ga('send', 'pageview', hash);
    };

    var sendScroll = function(event) {
        app.ports.scrollPercentage.send(getScroll());
    };

    var localStorageEvent = function(event) {
        if (event.key === STARRED_PRODUCTS_KEY) {
            app.ports.starredProductsRead.send(event.newValue);
        }
    };

    var starredProductsSave = function (string) {
        if (string) {
            window.localStorage.setItem(STARRED_PRODUCTS_KEY, string);
        }
    };

    window.addEventListener('load', sendHash, false);
    window.addEventListener('popstate', sendHash, false);
    window.addEventListener('scroll', sendScroll, false);
    window.addEventListener('storage', localStorageEvent, false);

    var app = Elm.fullscreen(
        Elm.Main,
        {locationHash : document.location.hash,
         scrollPercentage: getScroll(),
         starredProductsRead: ""
        });

    app.ports.starredProductsWrite.subscribe(starredProductsSave);
    app.ports.starredProductsRead.send(window.localStorage.getItem(STARRED_PRODUCTS_KEY));
}());
