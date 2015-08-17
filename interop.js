/*global Elm, ga */

(function () {
    var STARRED_PRODUCTS_KEY = "STARRED_PRODUCTS";

    var getViewport = function () {
        return {
            pageHeight: document.documentElement.scrollHeight,
            viewportTop: document.body.scrollTop,
            viewportHeight: document.documentElement.clientHeight
        };
    };

    var sendHash = function (event) {
        var hash = document.location.hash;
        app.ports.location.send(document.location.toString());
        app.ports.locationHash.send(hash);
        ga('send', 'pageview', {page: hash});
    };

    var sendViewport = function(event) {
        app.ports.viewport.send(getViewport());
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

    var postAnalyticsEvent = function (event) {
        var category, action, label, value;
        if (event !== null) {
            category = event[0];
            action   = event[1];
            label    = event[2];
            value    = event[3];

            ga('send', 'event', category, action, label, value);
        }
    };

    var scrollRequest = function (value) {
        if (value) {
            window.requestAnimationFrame(function () {
                window.scrollTo(0,value);
            });
        }
    };

    window.addEventListener('load', sendHash, false);
    window.addEventListener('popstate', sendHash, false);
    window.addEventListener('scroll', sendViewport, false);
    window.addEventListener('storage', localStorageEvent, false);

    var app = Elm.fullscreen(
        Elm.Main,
        {initialLocation : document.location.toString(),
         location : document.location.toString(),
         locationHash : document.location.hash,
         initialViewport: getViewport(),
         viewport: getViewport(),
         starredProductsRead: ""
        });

    app.ports.starredProductsWrite.subscribe(starredProductsSave);
    app.ports.starredProductsRead.send(window.localStorage.getItem(STARRED_PRODUCTS_KEY));
    app.ports.analyticsPort.subscribe(postAnalyticsEvent);
    app.ports.scrollTo.subscribe(scrollRequest);
	ga('send', 'pageview', {page: document.location.hash});
}());
