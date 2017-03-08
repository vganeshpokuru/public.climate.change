define(['angular'], function(angular) {
    'use strict';
    angular.module('resourcesModule', [])
        .factory('ResourcesService', ['$resource',
            function($resource) {

                var baseUrl = './data';


                return {
                    Master: {
                        funds: $resource(baseUrl + '/funds_datatable.json'),
                        sectors : $resource(baseUrl + '/sectors.json'),

                    },
                    States : {
                        all : $resource(baseUrl + '/states.json')
                    }

                }
            }
        ]);
});
