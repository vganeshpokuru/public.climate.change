'use-strict';
requirejs.config({
    baseUrl: './src',
    paths: {
        'angular': '../bower_components/angular/angular',
        /*require angular mocks for testing*/
        'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
        /*require angular resource for easily handling sending and receiving request*/
        'angular-resource': '../bower_components/angular-resource/angular-resource',
        /*require angular for better handling and binding controller*/
        'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
        /*require ui-bootstrap with the embeded template [http://angular-ui.github.io/bootstrap/]*/
        'ui-bootstrap-tpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        /*require jquery*/
        'jquery': '../bower_components/jquery/dist/jquery',
        /*require bootstrap.js to make bootstrap components work*/
        'bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'leaflet': '../bower_components/leaflet/dist/leaflet',
        'ui-leaflet': '../bower_components/ui-leaflet/dist/ui-leaflet.min',
        'angular-simple-logger':'../bower_components/angular-simple-logger/dist/angular-simple-logger.min',
        'google-tile-leaflet-plugin' : 'leaflet-plugins/GMTile'
        /*--insert code tag--do not remove*/
    },
    shim: {
        'angular': { exports: 'angular', deps: ['jquery'] },
        'angular-mocks': ['angular'],
        'angular-resource': ['angular'],
        'angular-ui-router': ['angular'],
        'ui-bootstrap-tpls': ['angular'],
        'bootstrap': ['jquery'],
        'ui-leaflet':['leaflet','angular-simple-logger','angular'],
        'angular-simple-logger':['angular'],
        'google-tile-leaflet-plugin':['ui-leaflet']

    }/*--requirejs config copy tag--do not remove*/
});
