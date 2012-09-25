
/**
 * Expose `APAError`
 */

module.exports = APAError;

/**
 * `APAError` class
 * @contructor
 * 
 * @param {String} message - error message
 *
 * @return {APAError}
 * @api private
 */

 function APAError(message){
 	Error.call(this);
 	Error.captureStackTrace(this,arguments.callee);
 	this.name = 'APAError';
 	this.message = message;
 }

 APAError.prototype.__proto__ = Error.prototype;
