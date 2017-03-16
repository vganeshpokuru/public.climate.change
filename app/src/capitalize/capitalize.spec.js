define(['angular-mocks', 'capitalize/capitalize'], function() {
    describe('filter 100000', function() {
        var capitalizeFilter;
        beforeEach(module('capitalizeModule'));
        beforeEach(inject(function(_$filter_) {
            capitalizeFilter = _$filter_('capitalizeFilter');
        }));

        it('should be equal 100,000', function() {
            expect(capitalizeFilter(100000)).toEqual('100,000');
        });
    });
});
