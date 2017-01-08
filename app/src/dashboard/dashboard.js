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
        '$timeout',
        '$filter',
        function ($scope, $location,$timeout,$filter) {
            /* initialize */
            $scope.funds = [
                {
                    name : 'Adaptation Fund',
                    shortName : 'AF'
                },
                {
                    name : 'Green Climate Fund',
                    shortName : 'GCF'
                }
            ];

            $scope.selectedFunds = [
                {
                    name : 'Adaptation Fund',
                    shortName : 'AF'
                },
                {
                    name : 'Green Climate Fund',
                    shortName : 'GCF'
                }
            ];

            var _initStats = {
                projects : 27,
                states : 16,
                sanctioned : '8m',
                beneficiaries : $filter('number')(19867,0)
            };
            $scope.stats = angular.copy(_initStats);



            var blues = ["#96D0DF","#85BFCE","#6Ea6BE","#6199B1","#5E8ca4","#58748A"],
                greens= ["#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"];


            var indianStates = [
                {
                    "id": "IN-AN",
                    "name" : "Andaman & Nicobar",
                    "projects": 4,
                    "amount_sanctioned": 4340000
                },
                {
                    "id": "IN-AP",
                    "name" : "Andhra Pradesh",
                    "projects": 3,
                    "amount_sanctioned": 5280000
                },
                {
                    "id": "IN-AR",
                    "name" : "Arunachal Pradesh",
                    "projects": 2,
                    "amount_sanctioned": 6276000
                },
                {
                    "id": "IN-AS",
                    "name" : "Assam",
                    "projects": 6,
                    "amount_sanctioned": 35465000
                },
                {
                    "id": "IN-BR",
                    "name" : "Bihar",
                    "projects": 1,
                    "amount_sanctioned": 2563000
                },
                {
                    "id": "IN-CH",
                    "name" : "Chandigarh",
                    "projects": 2,
                    "amount_sanctioned": 1738000
                },
                {
                    "id": "IN-CT",
                    "name" : "Chhattisgarh",
                    "projects": 4,
                    "amount_sanctioned": 4276000
                },
                {
                    "id": "IN-DD",
                    "name" : "Daman & Diu",
                    "projects": 6,
                    "amount_sanctioned": 3276000
                },
                {
                    "id": "IN-DL",
                    "name" : "Delhi",
                    "projects": 3,
                    "amount_sanctioned": 7764000
                },
                {
                    "id": "IN-DN",
                    "name" : "DN",
                    "projects": 5,
                    "amount_sanctioned": 8746000
                },
                {
                    "id": "IN-GA",
                    "name" : "Goa",
                    "projects": 2,
                    "amount_sanctioned": 9847000
                },
                {
                    "id": "IN-GJ",
                    "name" : "Gujrat",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-HP",
                    "name" : "Himachal Pradesh",
                    "projects": 2,
                    "amount_sanctioned": 2736000
                },
                {
                    "id": "IN-HR",
                    "name" : "Haryana",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-JH",
                    "name" : "Jharkhand",
                    "projects": 1,
                    "amount_sanctioned": 232000
                },
                {
                    "id": "IN-JK",
                    "name" : "Jammu & Kashmir",
                    "projects": 3,
                    "amount_sanctioned": 1241000
                },
                {
                    "id": "IN-KA",
                    "name" : "Karnataka",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-KL",
                    "name" : "Kerala",
                    "projects": 3,
                    "amount_sanctioned": 4234000
                },
                {
                    "id": "IN-LD",
                    "name" : "Lakshdweep",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-MH",
                    "name" : "Maharashtra",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-ML",
                    "name" : "Meghalaya",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-MN",
                    "name" : "Manipur",
                    "projects": 2,
                    "amount_sanctioned": 413000
                },
                {
                    "id": "IN-MP",
                    "name" : "Madhya Pradesh",
                    "projects": 3,
                    "amount_sanctioned": 234000
                },
                {
                    "id": "IN-MZ",
                    "name" : "Mizoram",
                    "projects": 1,
                    "amount_sanctioned": 423000
                },
                {
                    "id": "IN-NL",
                    "name" : "Nagaland",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-OR",
                    "name" : "Odisha",
                    "projects": 2,
                    "amount_sanctioned": 6453000
                },
                {
                    "id": "IN-PB",
                    "name" : "Punjab",
                    "projects": 3,
                    "amount_sanctioned": 4234000
                },
                {
                    "id": "IN-PY",
                    "name" : "Pondichery",
                    "projects": 5,
                    "amount_sanctioned": 5456000
                },
                {
                    "id": "IN-RJ",
                    "name" : "Rajasthan",
                    "projects": 2,
                    "amount_sanctioned": 234000
                },
                {
                    "id": "IN-SK",
                    "name" : "Sikkim",
                    "projects": 3,
                    "amount_sanctioned": 5233000
                },
                {
                    "id": "IN-TG",
                    "name" : "Telangana",
                    "projects": 3,
                    "amount_sanctioned": 5634000
                },
                {
                    "id": "IN-TN",
                    "name" : "Tamil Nadu",
                    "projects": 0,
                    "amount_sanctioned": 0
                },
                {
                    "id": "IN-TR",
                    "name" : "Tripura",
                    "projects": 1,
                    "amount_sanctioned": 214000
                },
                {
                    "id": "IN-UP",
                    "name" : "Uttar Pradesh",
                    "projects": 1,
                    "amount_sanctioned": 6235000
                },
                {
                    "id": "IN-UT",
                    "name" : "Uttarakhand",
                    "projects": 2,
                    "amount_sanctioned": 5266000
                },
                {
                    "id": "IN-WB",
                    "name" : "West Bengal",
                    "projects": 3,
                    "amount_sanctioned": 7364000
                }
            ];
            $scope.stateData = indianStates;

            //Construct map of the states for faster lookup to show the tooltip
            var _stateWiseDataMap = {},
                __constructDataMap = function(indianStates){
                    for (var i = 0, x = indianStates.length; i < x; i++) {
                        var stateData = indianStates[i];
                        var id = stateData.id.replace("IN-",'').toLowerCase();
                        _stateWiseDataMap[id] = stateData;
                    }
                };
            __constructDataMap(indianStates);


            var _totalProjects = 0, _maxProjects = 0;
            var _totalSanctionedAmount = 0,_maxSanctionedAmount = 0;
            for (var i = 0, x = indianStates.length; i < x; i++) {
                _totalProjects+=indianStates[i].projects;
                if(indianStates[i].projects > _maxProjects) _maxProjects = indianStates[i].projects;
                _totalSanctionedAmount += indianStates[i].amount_sanctioned;
                if(indianStates[i].amount_sanctioned > _maxSanctionedAmount) _maxSanctionedAmount = indianStates[i].amount_sanctioned;
            }
            $scope.totalSanctionedAmount = _totalSanctionedAmount;
            $scope.totalProjects = _totalProjects;
            $scope.maxSanctionedAmount = _maxSanctionedAmount;
            $scope.maxProjects = _maxProjects;

            for (var i = 0, x = indianStates.length; i < x; i++) {
                var state = indianStates[i];
                $scope[state.id.replace('IN-','').toLowerCase()+'Style'] = {fill : blues[Math.ceil(blues.length*(state.projects/_maxProjects))-1]};
            }


            var _getState = function(stateId){
                return _stateWiseDataMap[stateId.replace('IN-','').toLowerCase()];
            };
            var _updateStats= function(data){
                $scope.stats.projects = data.projects;
                $scope.stats.states = 1;
                $scope.stats.beneficiaries = $filter('number')((data.projects/_maxProjects)*Math.round(10000+Math.random()*30000),0);
                $scope.stats.sanctioned = Math.round(1+Math.random()*9)+'m';
            };

            var _resettats= function(data){
                $scope.stats = angular.copy(_initStats);
            };



            $scope.selectedState = {};
            //Handling Map Clicks
            var init = function(){
                console.log('initing');
                var _lastSelected = null,
                    _body = $('body');


                _body.on('click','.land',function(event){

                    if(_lastSelected) _lastSelected.classList.remove('selected');
                    var elem = this;

                    if(elem == _lastSelected) {
                        _lastSelected = null;
                        $scope.$apply(function(){
                            $scope.selectedState = {};
                        });

                        return;
                    }
                    _lastSelected = elem;
                    elem.classList.add('selected');
                    $scope.$apply(function(){
                        $scope.selectedState = _getState(elem.id);
                        _updateStats(_getState(elem.id));
                    });

                });

                _body.on('mouseout','.land',function(event,a,b){
                    $('.map-tooltip').remove();
                });

                var __tooltipTimeout = null;
                _body.on('mouseover','.land',function(event,a,b){
                    if(__tooltipTimeout) {
                        $timeout.cancel(__tooltipTimeout);
                        __tooltipTimeout = null;
                    }

                    var elem = this;
                    __tooltipTimeout = $timeout(function(){
                        $('.map-tooltip').remove();

                        var key = elem.id.replace('IN-','').toLowerCase(),
                            stateData = _stateWiseDataMap[key];
                        showTooltip(event.pageX, event.pageY,stateData.projects,$filter('currency')(stateData.amount_sanctioned,'$ ',0));
                        __tooltipTimeout = null;
                    },200);

                });

                function showTooltip(x, y, projects,amount) {
                    var rootElt = 'body';

                    $('<div id="tooltip" class="map-tooltip"><span class="projects">Projects : '+projects+'</span><br><span>Amount : '+amount+'</span></div>').css({
                        position: 'absolute',
                        display: 'none',
                        'z-index': '1010',
                        top: y,
                        left: x
                    }).prependTo(rootElt).show();
                }
            };

            init();

        }
    ]);
});
