require([
    'angular',
    'jquery',
    'angular-resource',
    'angular-ui-router',
    'ui-bootstrap-tpls',
    'bootstrap',
    'ui-leaflet',
    'google-tile-leaflet-plugin',
    'home/home',
    'dashboard/dashboard',
    'directives/statbox/statbox',
    'angular-chosen-localytics',
    'angular-animate',
    'countup',
    'angular-countup',
    'angular-chartjs',
    'datatableParserService/datatableParserService',
    'capitalize/capitalize',
    'angular-multiselect'
], function(angular) {
    'use strict';

    /*App Module*/
    angular.element(document).ready(function () {
        /*smart works go here*/
        var $html = angular.element('html');
        angular.module('webApp', [
            'ui.router',
            'ngResource',
            'ui.bootstrap',
            'homeModule',
            'dashboardModule',
            'statboxModule',
            'nemLogging',
            'ui-leaflet',
            'localytics.directives',
            'ngAnimate',
            'countUpModule',
            'chart.js',
            'datatableParserModule',
            'capitalizeModule',
            'angularjs-dropdown-multiselect'
        ]).config(['$urlRouterProvider', '$provide', function($urlRouterProvider, $provide) {
            $urlRouterProvider.otherwise('/');

            /* change configure to use [[ to be the interpolation ([[2 + 2]]) */
            //$interpolateProvider.startSymbol('[[');
            //$interpolateProvider.endSymbol(']]');

            /* add safeApply function for $rootScope - called by $scope.$root.safeApply(fn) */
            $provide.decorator('$rootScope', [
                '$delegate',
                function($delegate) {
                    $delegate.safeApply = function(fn) {
                        var phase = $delegate.$$phase;
                        if (phase === '$apply' || phase === '$digest') {
                            if (fn && typeof fn === 'function') {
                                fn();
                            }
                        } else {
                            $delegate.$apply(fn);
                        }
                    };
                    return $delegate;
                }
            ]);
        }]).config(['$qProvider', function($qProvider) {
            $qProvider.errorOnUnhandledRejections(false);
        }]);

        /*bootstrap model*/
        angular.bootstrap($html, ['webApp']);
    });
});
