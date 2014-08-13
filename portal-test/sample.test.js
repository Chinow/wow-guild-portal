/*var jsdom = require("jsdom");
var document = jsdom('<html><head><script></script></head><body></body></html>');
var window = document.createWindow();
var jQuery, $ = require("jquery").create(window);
var navigator = window.navigator = {};*/

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);


describe('My browserified tests', function() {

	it('should have mocha super-powers', function() {
		expect(true).to.be.true;

	});

	it('should have mocha false to be true', function() {
		expect(false).to.be.true;

	});

});