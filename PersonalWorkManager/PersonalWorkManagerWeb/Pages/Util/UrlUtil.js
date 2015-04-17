/*---   U R L   U T I L   ---*/
var UrlUtil = (function () {

    function resolveURL(url) {
        var site = window.location.pathname
            .substring(1, window.location.pathname.indexOf('/', 1));
        return window.location.protocol + "//" + window.location.host + "/" + site + url;
    }
    function getUrlVars() {
        var vars = [],
            hash,
            hashes = window.location.href
                .slice(window.location.href.indexOf('?') + 1).split('&'),
            i;
        for (i = 0; i < hashes.length; i += 1) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    return {
        resolveURL: function (url) { return resolveURL(url); },
        getUrlVars: function () { return getUrlVars(); }
    };

}());
