var util = require('util');

function AppError(message, status) {
  Error.call(this); //super constructor
  Error.captureStackTrace(this, this.constructor); //super helper method to include stack trace in error object

  this.name = this.constructor.name; //set our function’s name as error name.
  this.message = message; //set the error message
  this.status = status; //set the error status code
}

// inherit from Error
util.inherits(AppError, Error);

module.exports = AppError;
