define(['angular-mocks', 'statbox/statbox'], function() {
    describe('directive with templateUrl', function() {
        var element;
        var $scope;
        beforeEach(module('statboxModule'));
        beforeEach(module('src/statbox/statbox.tpl.html'));
        beforeEach(inject(function($compile, _$rootScope_) {
            $scope = _$rootScope_;
            element = angular.element("<statbox></statbox>");
            element = $compile(element)($scope);
        }));

        it('template should be loaded', function() {
            $scope.$digest();
            expect(element.html()).toBe('This is directive for dummy');
        });
    });
});
