define(['angular', 'angular-ui-router'], function (angular) {
    angular.module('dashboardModule', ['ui.router']).config(['$stateProvider', function ($stateProvider) {
        /*config path for dashboard module*/
        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'src/dashboard/dashboard.tpl.html',
            controller: 'DummyDashboardController'
        });
    }]).controller('DummyDashboardController', [
        '$scope',
        '$location',
        function ($scope, $location) {
            /* initialize */
            $scope.layers = {
                baselayers: {
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            }

            $scope.tiles = {
                name: 'Mapbox Wheat Paste',
                url: '//api.mapbox.com/styles/v1/{user}/{mapId}/tiles/256/{z}/{x}/{y}?access_token={apiKey}',
                type: 'xyz',
                options: {
                    user: 'pranjalgoswami',
                    apiKey: 'pk.eyJ1IjoicHJhbmphbGdvc3dhbWkiLCJhIjoiY2l4a2NjMnhjMDAyajMzbXV0Y2xsbXJjbyJ9.BtaB5o2A8DPwlykOSnHjbw',
                    mapId: 'cixke5m41004r2snvp0dv7vt5'
                }
            }

            $scope.apStyle = {fill: 'steelblue'};
            var blues = ["#96D0DF","#85BFCE","#6Ea6BE","#6199B1","#5E8ca4","#58748A"],
                greens= ["#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"];


            var indianStates = [
                {
                    "id": "IN-AN",
                    "projects": 4,
                    "amount_sanctioned": 4340000
                },
                {
                    "id": "IN-AP",
                    "projects": 3,
                    "amount_sanctioned": 5280000
                },
                {
                    "id": "IN-AR",
                    "projects": 2,
                    "amount_sanctioned": 6276000
                },
                {
                    "id": "IN-AS",
                    "projects": 6,
                    "amount_sanctioned": 35465000
                },
                {
                    "id": "IN-BR",
                    "projects": 1,
                    "amount_sanctioned": 2563000
                },
                {
                    "id": "IN-CH",
                    "projects": 2,
                    "amount_sanctioned": 1738000
                },
                {
                    "id": "IN-CT",
                    "projects": 4,
                    "amount_sanctioned": 4276000
                },
                {
                    "id": "IN-DD",
                    "projects": 6,
                    "amount_sanctioned": 3276000
                },
                {
                    "id": "IN-DL",
                    "projects": 3,
                    "amount_sanctioned": 7764000
                },
                {
                    "id": "IN-DN",
                    "projects": 5,
                    "amount_sanctioned": 8746000
                },
                {
                    "id": "IN-GA",
                    "projects": 2,
                    "amount_sanctioned": 9847000
                },
                {
                    "id": "IN-GJ",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-HP",
                    "projects": 2,
                    "amount_sanctioned": 2736000
                },
                {
                    "id": "IN-HR",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-JH",
                    "projects": 1,
                    "amount_sanctioned": 232000
                },
                {
                    "id": "IN-JK",
                    "projects": 3,
                    "amount_sanctioned": 1241000
                },
                {
                    "id": "IN-KA",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-KL",
                    "projects": 3,
                    "amount_sanctioned": 4234000
                },
                {
                    "id": "IN-LD",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-MH",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-ML",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-MN",
                    "projects": 2,
                    "amount_sanctioned": 413000
                },
                {
                    "id": "IN-MP",
                    "projects": 3,
                    "amount_sanctioned": 234000
                },
                {
                    "id": "IN-MZ",
                    "projects": 1,
                    "amount_sanctioned": 423000
                },
                {
                    "id": "IN-NL",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-OR",
                    "projects": 2,
                    "amount_sanctioned": 6453000
                },
                {
                    "id": "IN-PB",
                    "projects": 3,
                    "amount_sanctioned": 4234000
                },
                {
                    "id": "IN-PY",
                    "projects": 5,
                    "amount_sanctioned": 5456000
                },
                {
                    "id": "IN-RJ",
                    "projects": 2,
                    "amount_sanctioned": 234000
                },
                {
                    "id": "IN-SK",
                    "projects": 3,
                    "amount_sanctioned": 5233000
                },
                {
                    "id": "IN-TG",
                    "projects": 3,
                    "amount_sanctioned": 5634000
                },
                {
                    "id": "IN-TN",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-TR",
                    "projects": 1,
                    "amount_sanctioned": 214000
                },
                {
                    "id": "IN-UP",
                    "projects": 1,
                    "amount_sanctioned": 6235000
                },
                {
                    "id": "IN-UT",
                    "projects": 2,
                    "amount_sanctioned": 5266000
                },
                {
                    "id": "IN-WB",
                    "projects": 3,
                    "amount_sanctioned": 7364000
                }
            ];


            var _totalProjects = 0, _maxProjects = 0;
            var _totalSanctionedAmount = 0;
            for (var i = 0, x = indianStates.length; i < x; i++) {
                _totalProjects+=indianStates[i].projects;
                if(indianStates[i].projects > _maxProjects) _maxProjects = indianStates[i].projects;
                _totalSanctionedAmount += indianStates[i].amount_sanctioned;
            }
            for (var i = 0, x = indianStates.length; i < x; i++) {
                var state = indianStates[i];
                $scope[state.id.replace('IN-','').toLowerCase()+'Style'] = {fill : blues[Math.ceil(blues.length*(state.projects/_maxProjects))]};
            }
            console.log($scope);
        }
    ]);
});
