define(['angular-mocks', 'dashboard/dashboard'], function() {
    describe('controller title', function() {
        var $scope;
        var $location;
        var dummyDashboardController;
        beforeEach(module('dashboardModule'));
        beforeEach(inject(function(_$injector_, _$rootScope_) {
            $scope = _$rootScope_.$new();
            $location = _$injector_.get('$location');
            var $controller = _$injector_.get('$controller');
            dummyDashboardController = $controller('DummyDashboardController', {
                '$scope': $scope,
                '$location': $location
            });
        }));

        it('should be equal dummy', function() {
            expect($scope.pageTitle).toEqual('dummy');
        });
    });
});
