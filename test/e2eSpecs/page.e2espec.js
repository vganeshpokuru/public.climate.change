describe('home page title', function() {
    var ptor = protractor.getInstance();
    it('should be nabard', function() {
        ptor.get('/#');
        expect(ptor.getTitle()).toBe('nabard');
    });
});
