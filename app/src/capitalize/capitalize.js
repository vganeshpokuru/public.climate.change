define(['angular'], function(angular) {
    'use strict';
    angular.module('capitalizeModule', [])
        .filter('capitalize', function() {
            return function(input,all) {
                var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
                return (!!input) ? input.toString().replace(reg, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }) : '';
            };
        });
});
