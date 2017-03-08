define(['angular-mocks', 'datatableParserService/datatableParserService'], function() {
    describe('service name', function() {
        var DatatableParserServiceService;
        beforeEach(module('datatableParserServiceModule'));
        beforeEach(inject(function(_DatatableParserServiceService_) {
            DatatableParserServiceService = _DatatableParserServiceService_;
        }));

        it('should be equal dummy', function() {
            expect(DatatableParserServiceService).toEqual('Hello world');
        });
    });
});
