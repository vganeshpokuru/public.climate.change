'use strict';

describe('Service: datatableParserService', function () {

  // load the service's module
  beforeEach(module('nabardApp'));

  // instantiate service
  var datatableParserService;
  beforeEach(inject(function (_datatableParserService_) {
    datatableParserService = _datatableParserService_;
  }));

  it('should do something', function () {
    expect(!!datatableParserService).toBe(true);
  });

});
