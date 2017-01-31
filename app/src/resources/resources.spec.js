define(['angular-mocks', 'resources/resources'], function() {
    describe('service name', function() {
        var ResourcesService;
        beforeEach(module('resourcesModule'));
        beforeEach(inject(function(_ResourcesService_) {
            ResourcesService = _ResourcesService_;
        }));

        it('should be equal dummy', function() {
            expect(ResourcesService).toEqual('Hello world');
        });
    });
});
