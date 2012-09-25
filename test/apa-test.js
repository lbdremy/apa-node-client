/** 
 * Module dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	utils = require('../lib/utils'),
	apa = require('../'),
	APAError = require('../lib/apa-error')
	privateOptions = require('./config-private');


// Test suite

describe('apa',function(){
	describe('#createClient()',function(){
		it('should return a `Client` instance',function(){
			var client = apa.createClient({
				awsAccessKeyId : 'dummyAccessKeyId',
				awsSecretKey : '1234567890',
				associateTag : 'companyXdb'
			});
			assert.equal(client.awsAccessKeyId,'dummyAccessKeyId');
			assert.equal(client.awsSecretKey,'1234567890');
			assert.equal(client.associateTag,'companyXdb');
			assert.equal(client.endpoint,'ecs.amazonaws.com');
			assert.equal(client.service,'AWSECommerceService');
		});
	});
	describe('#_generateSignature()',function(){
		it('should return a signature following APA API guidelines',function(){
			var client = apa.createClient({
				awsAccessKeyId : 'AKIAIOSFODNN7EXAMPLE',
				awsSecretKey : '1234567890',
				associateTag : 'companyXdb'
			});
			// Hack endpoint
			client.endpoint = 'webservices.amazon.com';
			var parameters = {
				Service : 'AWSECommerceService',
				AWSAccessKeyId : 'AKIAIOSFODNN7EXAMPLE',
				Operation : 'ItemLookup',
				ItemId : '0679722769',
				ResponseGroup : 'ItemAttributes,Offers,Images,Reviews',
				Version : '2009-01-06',
				Timestamp :  '2009-01-01T12:00:00Z'
			};
			var signature = client._generateSignature(parameters);
			assert.equal(signature,'M/y0+EAFFGaUAp4bWv/WEuXYah99pVsxvqtAuC8YN7I=');
		});
	});
	describe('#execute()',function(){
		it('should return the response sent by Amazon as an javascript object',function(done){
			var client = apa.createClient(privateOptions);
			client.execute('ItemSearch',{
			    SearchIndex : 'All',
			    Keywords : 'TV Plasma',
			    ResponseGroup : 'OfferFull,Images,ItemAttributes,SalesRank,EditorialReview',
			    Availability : 'Available'
			},function(err,data){
				assert.notInstanceOf(err,Error);
				assert.isObject(data);
				done();
			});
		});
		it('should return an error if the parameters sent do not follow the APA API guidelines',function(done){
			var client = apa.createClient(privateOptions);
			client.execute('ItemSearch',{
			    SearchIndex : 'IncorrectSearchIndex',
			    Keywords : 'TV Plasma',
			    ResponseGroup : 'OfferFull,Images,ItemAttributes,SalesRank,EditorialReview',
			    Availability : 'Available'
			},function(err,data){
				assert.instanceOf(err,APAError);
				done();
			});
		});
		it('should send the request with all parameters correctly escaped',function(done){
			var client = apa.createClient(privateOptions);
			client.execute('ItemSearch',{
			    SearchIndex : 'All',
			    Keywords : 'TV\'s Plasma!',
			    ResponseGroup : 'OfferFull,Images,ItemAttributes,SalesRank,EditorialReview',
			    Availability : 'Available'
			},function(err,data){
				assert.notInstanceOf(err,Error);
				assert.isObject(data);
				done();
			});
		});
	});
	describe('#switchLocale("fr")',function(){
		it('should change the endpoint with the tld fr',function(){
			var client = apa.createClient({
				awsAccessKeyId : 'AKIAIOSFODNN7EXAMPLE',
				awsSecretKey : '1234567890',
				associateTag : 'companyXdb'
			});
			client.switchLocale('fr');
			assert.equal(client.endpoint,'ecs.amazonaws.fr');
		});
		it('should allow the client to search products available in France.',function(done){
			var client = apa.createClient(privateOptions);
			client.switchLocale('fr');
			assert.equal(client.endpoint,'ecs.amazonaws.fr');
			client.execute('ItemSearch',{
			    SearchIndex : 'All',
			    Keywords : 'TV Plasma',
			    ResponseGroup : 'OfferFull,Images,ItemAttributes,SalesRank,EditorialReview',
			    Availability : 'Available'
			},function(err,data){
				assert.notInstanceOf(err,Error);
				assert.isObject(data);
				done();
			});
		});
	});
	describe('#switchLocale("uk")',function(){
		it('should change the endpoint the tld co.uk',function(){
			var client = apa.createClient({
				awsAccessKeyId : 'AKIAIOSFODNN7EXAMPLE',
				awsSecretKey : '1234567890',
				associateTag : 'companyXdb'
			});
			client.switchLocale('uk');
			assert.equal(client.endpoint,'ecs.amazonaws.co.uk');
		});
	});
})