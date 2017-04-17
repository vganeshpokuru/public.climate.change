var allTestFiles = [];
var TEST_REGEXP = /app\/src\/\w*\/\w*\.spec\.js$/;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '../../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

requirejs.config({
    // Karma serves files from '/app'
    baseUrl: 'base/app/src',

    paths: {
        'angular': '../bower_components/angular/angular',
        /*require angular mocks for testing*/
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        /*require angular resource for easily handling sending and receiving request*/
        'angular-resource': '../bower_components/angular-resource/angular-resource',
        /*require angular for better handling and binding controller*/
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        'angular-animate': '../bower_components/angular-animate/angular-animate',
        /*require ui-bootstrap with the embeded template [http://angular-ui.github.io/bootstrap/]*/
        'ui-bootstrap-tpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        /*require jquery*/
        'jquery': '../bower_components/jquery/dist/jquery',
        /*require bootstrap.js to make bootstrap components work*/
        'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'leaflet': '../bower_components/leaflet/dist/leaflet',
        'ui-leaflet': '../bower_components/ui-leaflet/dist/ui-leaflet.min',
        'angular-simple-logger':'../bower_components/angular-simple-logger/dist/angular-simple-logger.min',
        'google-tile-leaflet-plugin' : 'leaflet-plugins/GMTile',
        'chosen': '../bower_components/chosen/chosen.jquery',
        'angular-chosen-localytics': '../bower_components/angular-chosen-localytics/dist/angular-chosen.min',
        'countup' : 'lib/countUp.js/dist/countUp',
        'angular-countup' : 'lib/countUp.js/dist/angular-countUp',
        'chart' : '../bower_components/chart.js/dist/Chart',
        'angular-chartjs' : '../bower_components/angular-chart.js/dist/angular-chart',
        'd3' : '../bower_components/d3/d3.min',
        'angular-multiselect' : '../bower_components/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min'
        /*--insert code tag--do not remove*/
    },
    shim: {
        'angular': { exports: 'angular', deps: ['jquery'] },
        'angular-mocks': ['angular'],
        'angular-resource': ['angular'],
        'angular-animate': ['angular'],
        'angular-ui-router': ['angular'],
        'ui-bootstrap-tpls': ['angular'],
        'bootstrap': ['jquery'],
        'ui-leaflet':['leaflet','angular-simple-logger','angular'],
        'angular-simple-logger':['angular'],
        'google-tile-leaflet-plugin':['ui-leaflet'],
        'chosen':['jquery'],
        'angular-chosen-localytics':['chosen','angular'],
        'angular-countup':['angular','countup'],
        'angular-chartjs' : ['angular','chart'],
        'angular-multiselect' : ['angular']


    },

    // ask Require.js to load these files (all our tests)
    deps: allTestFiles,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
