define(['angular', 'd3', 'angular-ui-router', 'resources/resources', 'datatableParserService/datatableParserService', 'dashboardDataService/dashboardDataService'], function (angular, d3) {
    angular.module('dashboardModule', ['ui.router', 'resourcesModule', 'datatableParserModule', 'dashboardDataServiceModule']).config(['$stateProvider', function ($stateProvider) {
        /*config path for dashboard module*/
        $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'src/dashboard/dashboard_v2.tpl.html',
            controller: 'DashboardController'
        });
    }]).controller('DashboardController', [
        '$scope',
        '$location',
        '$timeout',
        '$filter',
        'ResourcesService',
        'DatatableParserService',
        'DashboardDataServiceService',
        '$uibModal',
        function ($scope, $location, $timeout, $filter, resource, datatableParserService, dashboardDataServiceService, $uibModal) {


            //Load funds
            $scope.funds = [];

            resource.Master.funds.get(function (response) {
                $scope.funds = datatableParserService.parse(response);
                _selectAllFunds();
            }, function (error) {
                console.error('Error while loading funds', error);
            });
            $scope.selectedFunds = [];
            var _selectAllFunds = function () {
                for (var i = 0, x = $scope.funds.length; i < x; i++) {
                    $scope.selectedFunds.push($scope.funds[i].name)
                }
            };

            $scope.updateSelectedFunds = function (selectedFunds) {
                $scope.filterByFunds(selectedFunds);
            };

            //Load sectors
            /*
             $scope.sectors = [];
             resource.Master.sectors.query(function (response) {
             $scope.sectors = response;
             }, function (error) {
             console.error('Error while loading sectors', error);
             });
             */

            /* initialize */

            var _initStats = {
                projects: 0,
                states: 0,
                sanctioned: 0,
                beneficiaries: 0
            };
            $scope.stats = angular.copy(_initStats);

            var _resettats = function (data) {
                $scope.stats = angular.copy(_initStats);
            };

            var _updateTopLevelStats = function () {
                _resettats();
                for (var i = 0, x = $scope.stateData.length; i < x; i++) {
                    var sData = $scope.stateData[i];
                    $scope.stats.projects += sData.projects;
                    $scope.stats.states += 1;
                    $scope.stats.beneficiaries += sData.beneficiaries.total;
                    $scope.stats.sanctioned += sData.amount_sanctioned;

                }
            }


            var blues = ["#96D0DF", "#85BFCE", "#6Ea6BE", "#6199B1", "#5E8ca4", "#58748A"],
                greens = ["#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
                multiHues = ["#CFF3D2", "#AEE2C7", "#91D1BE", "#78BFB6", "#62ACAF", "#509AA9", "#4186A4", "#3573A0"],
                multiHues2 = ["#FFE39F", "#D6D7A1", "#B3C9A2", "#93B8A2", "#77A7A2", "#6097A1", "#4C84A0", "#3A719E", "#2B5E9C", "#1F4B99"];

            var stateCodeMap = {"IN-AN": "Andaman and Nicobar Islands", "IN-AP": "Andhra Pradesh", "IN-AR": "Arunachal Pradesh", "IN-AS": "Assam", "IN-BR": "Bihar", "IN-CH": "Chandigarh", "IN-CT": "Chhattisgarh", "IN-DD": "Daman and Diu", "IN-DL": "Delhi", "IN-DN": "Dadra and Nagar Haveli", "IN-GA": "Goa", "IN-GJ": "Gujarat", "IN-HP": "Himachal Pradesh", "IN-HR": "Haryana", "IN-JH": "Jharkhand", "IN-JK": "Jammu and Kashmir", "IN-KA": "Karnataka", "IN-KL": "Kerala", "IN-LD": "Lakshadweep", "IN-MH": "Maharashtra", "IN-ML": "Meghalaya", "IN-MN": "Manipur", "IN-MP": "Madhya Pradesh", "IN-MZ": "Mizoram", "IN-NL": "Nagaland", "IN-OR": "Odisha", "IN-PB": "Punjab", "IN-PY": "Puducherry", "IN-RJ": "Rajasthan", "IN-SK": "Sikkim", "IN-TG": "Telangana", "IN-TN": "Tamil Nadu", "IN-TR": "Tripura", "IN-UP": "Uttar Pradesh", "IN-UT": "Uttarakhand", "IN-WB": "West Bengal"};


            var indianStates = [];
            var _totalProjects = 0, _maxProjects = 0;
            var _totalSanctionedAmount = 0, _maxSanctionedAmount = 0;
            var _stateWiseDataMap = {},
                __constructDataMap = function (indianStates) {
                    for (var i = 0, x = indianStates.length; i < x; i++) {
                        var stateData = indianStates[i];
                        var id = stateData.id.replace("IN-", '').toLowerCase();
                        _stateWiseDataMap[id] = stateData;
                    }
                };


            $scope.filterByFunds = function (fundList) {
                dashboardDataServiceService.getAllStateListFilteredByFunds(fundList).then(function (filteredStates) {
                    $scope.stateData = filteredStates;

                    _updateTopLevelStats();

                    //Reset all states on map
                    for (var s in stateCodeMap) {
                        if (stateCodeMap.hasOwnProperty(s)) {
                            $scope[s.replace('IN-', '').toLowerCase() + 'Style'] = null;
                        }
                    }

                    for (var i = 0, x = filteredStates.length; i < x; i++) {

                        _totalProjects += filteredStates[i].projects;
                        if (filteredStates[i].projects > _maxProjects) _maxProjects = filteredStates[i].projects;
                        _totalSanctionedAmount += filteredStates[i].amount_sanctioned;
                        if (filteredStates[i].amount_sanctioned > _maxSanctionedAmount) _maxSanctionedAmount = filteredStates[i].amount_sanctioned;
                    }
                    $scope.totalSanctionedAmount = _totalSanctionedAmount;
                    $scope.totalProjects = _totalProjects;
                    $scope.maxSanctionedAmount = _maxSanctionedAmount;
                    $scope.maxProjects = _maxProjects;

                    for (var i = 0, x = filteredStates.length; i < x; i++) {
                        var state = filteredStates[i];
                        $scope[state.id.replace('IN-', '').toLowerCase() + 'Style'] = {fill: multiHues[Math.ceil(multiHues.length * (state.projects / _maxProjects)) - 1]};
                    }


                });
            }


            dashboardDataServiceService.getAllStateList().then(function (indianStates) {

                $scope.stateData = indianStates;

                _updateTopLevelStats();

                __constructDataMap(indianStates);

                for (var i = 0, x = indianStates.length; i < x; i++) {
                    _totalProjects += indianStates[i].projects;
                    if (indianStates[i].projects > _maxProjects) _maxProjects = indianStates[i].projects;
                    _totalSanctionedAmount += indianStates[i].amount_sanctioned;
                    if (indianStates[i].amount_sanctioned > _maxSanctionedAmount) _maxSanctionedAmount = indianStates[i].amount_sanctioned;
                }
                $scope.totalSanctionedAmount = _totalSanctionedAmount;
                $scope.totalProjects = _totalProjects;
                $scope.maxSanctionedAmount = _maxSanctionedAmount;
                $scope.maxProjects = _maxProjects;

                for (var i = 0, x = indianStates.length; i < x; i++) {
                    var state = indianStates[i];
                    $scope[state.id.replace('IN-', '').toLowerCase() + 'Style'] = {fill: multiHues[Math.ceil(multiHues.length * (state.projects / _maxProjects)) - 1]};
                }

                init();
                //_initBarChart();

                //Adding the legend
                setTimeout(function () {
                    var svg = d3.select('svg#india-map');
                    var height = svg.style('height').replace("px", "");
                    var g = svg.append('g').attr('id', 'legend');
                    var ls_h = 20, ls_w = 20;
                    height = height - ls_h;
                    var colorLength = multiHues.length;
                    for (var i = 0; i < colorLength; i++) {
                        g.append('rect').attr('x', 5).attr('y', height - i * ls_h).attr('width', ls_w).attr('height', ls_h).style('fill', multiHues[colorLength - i - 1]);
                    }
                    g.append('rect').attr('x', 5).attr('y', height - i * ls_h).attr('width', ls_w).attr('height', ls_h).style('fill', '#e0eef5');
                    console.log(height);
                    g.append('text').attr('x', 10 + ls_w).attr('y', height + ls_h).text('>= ' + _maxProjects + ' Projects')
                    g.append('text').attr('x', 10 + ls_w).attr('y', height - ls_h * (colorLength - 0.5)).text('No Projects')
                }, 1000);


            }, function (error) {
                console.error('data service error', error);

            });


            var _getState = function (stateId) {
                return _stateWiseDataMap[stateId.replace('IN-', '').toLowerCase()];
            };
            var _updateStats = function (data) {

                resource.States.projects.get({R_accountNo: data.id}, function (response) {
                    $scope.selectedState.projectsData = datatableParserService.parse(response);
                    console.log($scope.selectedState.projectsData);
                });

            };


            $scope.zoomOutMap = function (event) {

                var map = d3.select('svg #nation');
                var mapContainer = document.getElementById('nation');
                mapContainer.setAttribute('class', '');
                map.transition()
                    .duration(750).attr("transform", "translate(0,0)scale(1)");
                if (!event) {
                    $scope.$apply(function () {
                        $scope.selectedState = {};
                    });
                } else {
                    $scope.selectedState = {};
                }


                var mapContainer = document.getElementById('nation');
                mapContainer.classList.remove('state-selected');
                $('#india-map-container').removeClass('state-selected');
                $('body').removeClass('state-selected');
                //_resettats();
            };
            $scope.selectedState = {};
            window.d3 = d3;
            var centered;
            //Handling Map Clicks
            var init = function () {

                var _lastSelected = null,
                    _body = $('body');


                //Select a state
                _body.on('click', '.land', function (event) {

                    if (_lastSelected) _lastSelected.classList.remove('selected');
                    var elem = this;

                    var state = d3.select('svg #' + elem.id);

                    var element = state.node();
                    // use the native SVG interface to get the bounding box
                    var bbox = element.getBBox();

                    var map = d3.select('svg #nation'),
                        width = 640,
                        height = 800;

                    var x, y, k;

                    x = bbox.x + bbox.width / 2;
                    y = bbox.y + bbox.height / 2;
                    k = 4;


                    map.transition()
                        .duration(750)
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + (k * 0.8) + ")translate(" + -x + "," + -y + ")");

                    if (elem == _lastSelected) {
                        _lastSelected = null;
                        $scope.zoomOutMap();
                        return;
                    }
                    _lastSelected = elem;
                    var mapContainer = document.getElementById('nation');
                    mapContainer.classList.add('state-selected');
                    $('#india-map-container').addClass('state-selected');
                    $('body').addClass('state-selected');
                    elem.classList.add('selected');
                    $scope.$apply(function () {
                        $scope.selectedState = _getState(elem.id);
                        if (!$scope.selectedState) {
                            $scope.selectedState = {
                                name: stateCodeMap[elem.id],
                                projects: 0,
                                beneficiaries: {total: 0},
                                projectsData: []
                            }
                        }
                        _updateStats(_getState(elem.id));
                    });

                });

                _body.on('mouseout', '.land', function (event, a, b) {
                    $('.map-tooltip').remove();
                });

                var __tooltipTimeout = null;
                _body.on('mouseover', '.land', function (event, a, b) {
                    if (__tooltipTimeout) {
                        $timeout.cancel(__tooltipTimeout);
                        __tooltipTimeout = null;
                    }

                    var elem = this;
                    __tooltipTimeout = $timeout(function () {
                        $('.map-tooltip').remove();

                        var key = elem.id.replace('IN-', '').toLowerCase(),
                            stateData = _stateWiseDataMap[key];
                        if (stateData) {
                            showTooltip(event.pageX, event.pageY, stateData.projects, $filter('currency')(stateData.amount_sanctioned, '$ ', 0));
                        }

                        __tooltipTimeout = null;
                    }, 200);

                });

                function showTooltip(x, y, projects, amount) {
                    var rootElt = 'body';

                    $('<div id="tooltip" class="map-tooltip"><span class="projects">Projects : ' + projects + '</span><br><span>Amount : ' + amount + '</span></div>').css({
                        position: 'absolute',
                        display: 'none',
                        'z-index': '1010',
                        top: y + 10,
                        left: x + 10
                    }).prependTo(rootElt).show();
                }
            };


            $scope.labels = [];
            $scope.series = ['Fund Allocation'];
            $scope.data = [
                []
            ];
            $scope.barChartOptions = {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                //stepSize: 1,
                                beginAtZero: true,
                                label : 'Funds Allocated'
                            }
                        }
                    ]
                }
            };


            var _updateBarChart = function (stateData) {
                if (!stateData) return;
                var labels = [];
                var data = [];
                for (var i = 0, x = stateData.length; i < x; i++) {
                    if (i > 18) break;
                    var state = stateData[i];
                    console.log(state);
                    labels.push(state.name);
                    data.push(state.amount_sanctioned);
                }

                $scope.labels = angular.copy(labels);
                $scope.data[0] = angular.copy(data);

            };


            $scope.sectorWiseLabels = ["Energy", "Education"];
            $scope.sectorWiseData = [40, 60];
            var _sectorMap = {};

            var _updateSectorWiseData = function (data) {
                if (!data) return;
                for (var i = 0, x = data.length; i < x; i++) {
                    var state = data[i];
                    //loop through state.projectDetails
                    for (var j = 0, y = state.projectDetails.length; j < y; j++) {
                        var project = state.projectDetails[j];
                        if (!_sectorMap.hasOwnProperty(project.projectCategory)) {
                            _sectorMap[project.projectCategory] = 0;
                        }
                        _sectorMap[project.projectCategory] += project.releasedAmount;
                    }
                }
                $scope.sectorWiseLabels = [];
                $scope.sectorWiseData = [];

                for (var key in _sectorMap) {
                    if (!_sectorMap.hasOwnProperty(key)) continue;
                    $scope.sectorWiseLabels.push(key);
                    $scope.sectorWiseData.push(_sectorMap[key]);
                }
            };

            $scope.$watch(function () {
                return $scope.stateData;
            }, function (newVal, oldVal) {
                _updateSectorWiseData(newVal);
                _updateBarChart(newVal);
            });


            $scope.selectedProject = {};
            $scope.openProjectDetails = function (project) {
                $scope.selectedProject = project;

                $('#projectModal').modal('show')
            };

        }
    ])
        .controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
            var $ctrl = this;
            $ctrl.items = items;
            $ctrl.selected = {
                item: $ctrl.items[0]
            };

            $ctrl.ok = function () {
                $uibModalInstance.close($ctrl.selected.item);
            };

            $ctrl.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        });
});
