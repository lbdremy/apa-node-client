/**
 * Modules dependencies
 */

var crypto = require('crypto');

/**
 * Calculate an RFC 2104-compliant HMAC with the SHA256 hash algorithm using `string` with the `secretKey`
 *
 * @param {String} string - string to use
 * @param {String} secretKey - secret key
 *
 * @return {String}
 * @api private
 */

exports.calculateHMAC = function(string,secretKey){
    return crypto.createHmac('sha256', secretKey).update(string).digest('base64');
}