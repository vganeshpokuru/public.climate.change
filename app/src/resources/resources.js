define(['angular'], function(angular) {
    'use strict';
    angular.module('resourcesModule', [])
        .factory('ResourcesService', ['$resource',
            function($resource) {

                var env = 'local'; //Change to remote if you want to connect to server and not use dummy data
                var baseUrl = './data';
                var suffix ='.json'

                if(env !== 'local'){
                    baseUrl = 'https://54.251.116.119:7443/fineract-provider/api/v1/runreports';
                    suffix = '';
                }


                return {
                    Master: {
                        funds: $resource(baseUrl + '/Funds'+suffix),
                        sectors : $resource(baseUrl + '/sectors.json')

                    },
                    Projects :{
                      all :   $resource(baseUrl + '/allProjects.json'),
                      all_details : $resource(baseUrl + '/All Project Details'+suffix)
                    },
                    States : {
                        all : $resource(baseUrl + '/states_datatables.json'),
                        projects : $resource(baseUrl +'/projectsByState.json')
                    }

                }
            }
        ]);
});
