const SingleError = require('../single-error');

module.exports = class AuthorizationError extends SingleError {
  constructor() {
    const details = {
      path: 'authorization',
    };

    // Calling parent constructor of base Error class.
    super('Unauthorized', 'unauthorized', details);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;
    this.statusCode = 403;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
  }
};
