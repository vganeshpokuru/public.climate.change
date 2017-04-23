define(['angular'], function(angular) {
    'use strict';
    angular.module('statboxModule', [])
        .directive('statbox', [
            function() {
                return {
                    restrict: 'E',
                    replace: true,
                    templateUrl: 'src/directives/statbox/statbox.tpl.html',
                    scope: {
                        title : "@",
                        stat : "=",
                        statStyle : "=",
                        size:'@',
                        options:"="
                    },
                    link: function(scope, element, attrs) {

                    }
                };
            }
        ]);
});
