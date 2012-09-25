/** 
 * Module dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	utils = require('../lib/utils');


// Test suite

describe('utils',function(){
	describe('#calculateHMAC()',function(){
		it('should return an RFC 2104-compliant HMAC with the SHA256 hash algorithm',function(){
			var string = 'GET\n'
						+ 'webservices.amazon.com\n'
						+ '/onca/xml\n'
						+ 'AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&ItemId=0679722769&Operation=ItemLookup&ResponseGroup=ItemAttributes%2COffers%2CImages%2CReviews&Service=AWSECommerceService&Timestamp=2009-01-01T12%3A00%3A00Z&Version=2009-01-06'
			var secretKey = '1234567890';
			var hmac = utils.calculateHMAC(string,secretKey);
			assert.equal(hmac,'M/y0+EAFFGaUAp4bWv/WEuXYah99pVsxvqtAuC8YN7I=');
		});
	});
});	