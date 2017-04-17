define(['angular-mocks', 'dashboardDataService/dashboardDataService'], function() {
    describe('service name', function() {
        var DashboardDataServiceService;
        beforeEach(module('dashboardDataServiceModule'));
        beforeEach(inject(function(_DashboardDataServiceService_) {
            DashboardDataServiceService = _DashboardDataServiceService_;
        }));

        it('should be equal dummy', function() {
            expect(DashboardDataServiceService).toEqual('Hello world');
        });
    });
});
