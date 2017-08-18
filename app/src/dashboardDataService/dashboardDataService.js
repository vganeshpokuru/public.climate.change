define(['angular', 'resources/resources', 'datatableParserService/datatableParserService'], function (angular) {
    'use strict';
    angular.module('dashboardDataServiceModule', ['resourcesModule', 'datatableParserModule'])
        .factory('DashboardDataServiceService', ['$q', 'ResourcesService', 'DatatableParserService',
            function ($q, resource, datatableParserService) {
                var _allProjectsData = null,
                    _stateWiseDB = null,
                    countryLevelData = {};

                var indianStates = null;
                var stateCodeMap = {"IN-AN": "Andaman and Nicobar Islands", "IN-AP": "Andhra Pradesh", "IN-AR": "Arunachal Pradesh", "IN-AS": "Assam", "IN-BR": "Bihar", "IN-CH": "Chandigarh", "IN-CT": "Chhattisgarh", "IN-DD": "Daman and Diu", "IN-DL": "Delhi", "IN-DN": "Dadra and Nagar Haveli", "IN-GA": "Goa", "IN-GJ": "Gujarat", "IN-HP": "Himachal Pradesh", "IN-HR": "Haryana", "IN-JH": "Jharkhand", "IN-JK": "Jammu and Kashmir", "IN-KA": "Karnataka", "IN-KL": "Kerala", "IN-LD": "Lakshadweep", "IN-MH": "Maharashtra", "IN-ML": "Meghalaya", "IN-MN": "Manipur", "IN-MP": "Madhya Pradesh", "IN-MZ": "Mizoram", "IN-NL": "Nagaland", "IN-OR": "Odisha", "IN-PB": "Punjab", "IN-PY": "Puducherry", "IN-RJ": "Rajasthan", "IN-SK": "Sikkim", "IN-TG": "Telangana", "IN-TN": "Tamil Nadu", "IN-TR": "Tripura", "IN-UP": "Uttar Pradesh", "IN-UT": "Uttarakhand", "IN-WB": "West Bengal"};

                var _getAllProjects = function () {


                    var deferred = $q.defer();

                    if (_allProjectsData == null) {
                        //fetch resource
                        resource.Projects.all_details.get(function (response) {
                            var r = datatableParserService.parse(response);
                            _allProjectsData = r;
                            deferred.resolve(r);

                        }, function (error) {
                            console.error('Could not fetch Projects', error);
                            deferred.reject(error);
                        });

                    } else {
                        deferred.resolve(_allProjectsData);
                    }

                    return deferred.promise;
                };

                var _getAllStateMap = function () {

                    var deferred = $q.defer();

                    if (_stateWiseDB == null) {
                        //fetch all projects data
                        _stateWiseDB = {};

                        _getAllProjects().then(function (r) {


                            for (var i = 0, x = r.length; i < x; i++) {
                                var project = r[i];
                                var state = _stateWiseDB[project.state];
                                if (!state) {
                                    state = {
                                        projects: 0,
                                        beneficiaries: {
                                            total: 0,
                                            direct: 0,
                                            indirect: 0
                                        },
                                        projectDetails: [],
                                        amount_sanctioned: 0,
                                        decimals:3
                                    };
                                    state.id = project.state;
                                    state.name = stateCodeMap[project.state];
                                    _stateWiseDB[project.state] = state;
                                }

                                state.projects += 1;
                                state.beneficiaries.total += project.directbenificieries + project.indirectbenificieries;
                                state.beneficiaries.direct += project.directbenificieries;
                                state.beneficiaries.indirect += project.indirectbenificieries;
                                state.projectDetails.push(project);
                                state.amount_sanctioned += project.projectCost;

                            }

                            deferred.resolve(_stateWiseDB);

                        }, function (error) {
                            console.error('Could not fetch Projects', error);
                            deferred.reject(error);
                        });

                    } else {
                        deferred.resolve(_stateWiseDB);
                    }

                    return deferred.promise;

                };

                var _getAllStateList = function () {


                    var deferred = $q.defer();

                    if (indianStates == null) {
                        indianStates = [];

                        _getAllStateMap().then(function () {

                            for (var s in _stateWiseDB) {
                                if (!_stateWiseDB.hasOwnProperty(s)) continue;
                                indianStates.push(_stateWiseDB[s]);
                            }
                            deferred.resolve(indianStates);
                        }, function (error) {
                            console.error('Could not fetch states list');
                            deferred.reject(error);
                        });

                    } else {
                        deferred.resolve(indianStates);
                    }

                    return deferred.promise;

                };

                var _getAllStateListFilteredByFunds = function (fundCodeList) {

                    var deferred = $q.defer();

                    var stateMap = {};

                    var filteredStateWiseData = [];


                    _getAllProjects().then(function (r) {

                        for (var i = 0, x = r.length; i < x; i++) {
                            var project = r[i];
                            if(fundCodeList.indexOf(project.fundName) < 0) continue;

                            var state = stateMap[project.state];
                            if (!state) {
                                state = {
                                    projects: 0,
                                    beneficiaries: {
                                        total: 0,
                                        direct: 0,
                                        indirect: 0
                                    },
                                    projectDetails: [],
                                    amount_sanctioned: 0,
                                    decimals:3
                                };
                                state.id = project.state;
                                state.name = stateCodeMap[project.state];
                                stateMap[project.state] = state;
                            }

                            state.projects += 1;
                            state.beneficiaries.total += project.directbenificieries + project.indirectbenificieries;
                            state.beneficiaries.direct += project.directbenificieries;
                            state.beneficiaries.indirect += project.indirectbenificieries;
                            state.projectDetails.push(project);
                            state.amount_sanctioned += parseFloat(project.projectCost);

                        }

                        for (var s in stateMap) {
                            if (!stateMap.hasOwnProperty(s)) continue;
                            filteredStateWiseData.push(stateMap[s]);
                        }

                        deferred.resolve(filteredStateWiseData);

                    }, function (error) {
                        console.error('Could not fetch Projects', error);
                        deferred.reject(error);
                    });


                    return deferred.promise;

                }

                return {
                    getAllProjects: _getAllProjects,

                    getAllStateMap: _getAllStateMap,

                    getAllStateList: _getAllStateList,

                    getAllStateListFilteredByFunds :_getAllStateListFilteredByFunds
                }
            }
        ]);
});
