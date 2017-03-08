define(['angular'], function(angular) {
    'use strict';
    angular.module('datatableParserModule', [])
        .factory('DatatableParserService', [
            function() {
                //Should return an array of column keys
                var metaMap = {};
                var getCoulmnHeaders = function(dataTable){
                    var columnKeys = [];
                    for (var i = 0, x = dataTable.columnHeaders.length; i < x; i++) {
                        var columnHeader = dataTable.columnHeaders[i];
                        columnKeys.push(columnHeader.columnName);
                        metaMap[columnHeader.columnName] = columnHeader;
                    }

                    return columnKeys;
                };

                var parseData = function(dataTable){
                    var keys = getCoulmnHeaders(dataTable);

                    var data = [];
                    for (var i = 0, x = dataTable.data.length; i < x; i++) {
                        var rowData = dataTable.data[i];

                        var obj = {};
                        for(var j= 0, y = keys.length; j<y;j++){
                            if(metaMap[keys[j]].columnDisplayType == 'DECIMAL'){
                                obj[keys[j]] = parseFloat(rowData.row[j]);
                            } else if(metaMap[keys[j]].columnDisplayType == 'INTEGER'){
                                obj[keys[j]] = parseInt(rowData.row[j]);
                            } else {
                                obj[keys[j]] = rowData.row[j];
                            }

                        }
                        data.push(obj);
                    }

                    return data;
                };

                return {
                    parse : parseData
                }
            }
        ]);
});
