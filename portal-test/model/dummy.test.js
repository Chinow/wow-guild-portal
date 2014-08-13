var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var $ = require('jquery');
//var SPMRequest = require('../../app/js/model/spm-request');
//var Harbor = require('../../app/js/model/harbor');


describe('Dummy', function() {

	it("should return ok... it's a test's test ", function() {
		expect(true).to.be.equal(true);
		expect(false).to.be.eql(false);
	});
	
});
