/*!
 * apa
 * Copyright(c) 2012 HipSnip Limited
 * Author Rémy Loubradou <remyloubradou@gmail.com>
 * MIT Licensed
 */

/** 
 * Modules dependencies
 */

var http = require('http'),
	querystring = require('querystring'),
	xml2js = require('xml2js'),
	APAError = require('./apa-error'),
	utils = require('./utils');

// Parser
var parser = new xml2js.Parser();

/** 
 * Factory to create `Client`
 * 
 * @param {Object} options - 
 * @param {String} options.awsAccessKeyId - 
 * @param {String} options.awsSecretKey -
 * @param {String} options.associateTag - 
 * @param 
 */

exports.createClient = function(options){
	return new Client(options);
}

/**
 * `Client` class
 * @constructor
 *
 * @return {Client}
 * @api private
 */

function Client(options){
	// Endpoint
	this.endpoint = 'ecs.amazonaws.com';
	this.path = '/onca/xml';
	// Identifiers (required parameters)
	this.awsAccessKeyId = options.awsAccessKeyId;
	this.associateTag = options.associateTag;
	this.service = 'AWSECommerceService';
	// Secret key 
	this.awsSecretKey = options.awsSecretKey;
	// API version
	this.version = '2011-08-01';
}

/**
 * Send a HTTP request with the given `operation` and `parameters`
 * 
 * @param {String} operation - name of the operation
 * @param {Object} parameters - parameters for the given operation
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.execute = function(operation,parameters,callback){
	parameters['Operation'] = operation;
	parameters['Service'] = this.service;
	parameters['AWSAccessKeyId'] = this.awsAccessKeyId;
	parameters['AssociateTag'] = this.associateTag;
	parameters['Timestamp'] = new Date().toISOString();
	parameters['Version'] = this.version;
	parameters['Signature'] = this._generateSignature(parameters);
	var qs = querystring.stringify(parameters);
	var options = {
		host : this.endpoint,
		path : this.path + '?' + qs,
	};
	var request = http.get(options,function(res){
		var body = '';
		res.on('data',function(chunk){
			body += chunk;
		});
		res.on('end',function(){
			if(res.statusCode >= 200 && res.statusCode <= 299){
				parser.parseString(body,function(err,data){
					if(err) return callback(err);
					if(data.Items && data.Items.Request && data.Items.Request.IsValid === 'False'){
						var message = data.Items.Request.Errors.Error.Code 
							+ '.'
							+ data.Items.Request.Errors.Error.Message;
							err = new APAError(message);
					}
					callback(err,data);
				});
			}else{
				var err = new APAError('Receive HTTP status code ' + res.statusCode);
				callback(err);
			}
		})
	});
	request.on('error',function(err){
		callback(err);
	});
	return request;
}

/**
 * Change the tld of the endpoint based on the given `locale`
 *
 * @param {String} locale - country code
 *
 * @api public
 */

Client.prototype.switchLocale = function(locale){
	var tld = '';
	switch(locale){
		case 'us' :
			tld = 'com';
		break;
		case 'uk' :
			tld = 'co.uk';
		break;
		default :
			tld = locale.toLowerCase();
	} 
	this.endpoint = 'ecs.amazonaws.' + tld;
}

/**
 * Generate signature based on the `parameters` and `this.awsSecretKey`
 *
 * @param {Object} parameters - 
 *
 * @return {String}
 * @api private
 */

Client.prototype._generateSignature = function(parameters){
	var encodedParameters = querystring.stringify(parameters,'\n','=');
	var sortedParameters = encodedParameters.split('\n').sort();
	var canonicalForm = sortedParameters.join('&');
	var prependForm = 'GET\n'
		+ this.endpoint + '\n'
		+ this.path + '\n'
		+ canonicalForm;
	var hmac = utils.calculateHMAC(prependForm,this.awsSecretKey);
	return hmac;
}

