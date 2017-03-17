define(['angular'], function(angular) {
    'use strict';
    angular.module('resourcesModule', [])
        .factory('ResourcesService', ['$resource',
            function($resource) {

                var baseUrl = './data';


                return {
                    Master: {
                        funds: $resource(baseUrl + '/funds_datatable.json'),
                        sectors : $resource(baseUrl + '/sectors.json')

                    },
                    Projects :{
                      all :   $resource(baseUrl + '/allProjects.json')
                    },
                    States : {
                        all : $resource(baseUrl + '/states.json'),
                        projects : $resource(baseUrl +'/stateprojects_datatables.json')
                    }

                }
            }
        ]);
});
