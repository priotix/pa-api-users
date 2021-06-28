const request = require('request-promise');
const config = require('config');
const AuthFailedError = require('../libs/errors/services/auth-service-failure-error');
const MultiValidationError = require('../libs/errors/validation/multi-validate-error');
const ForbiddenError = require('../libs/errors/forbidden-error');

const service = {};

function authErrorHandler(reason) {
  const { message, errors } = reason.response.body;

  if (reason.statusCode === 409) {
    throw new MultiValidationError(message, errors);
  }

  if (reason.statusCode === 401) {
    throw new AuthFailedError(message, reason.statusCode);
  }

  if (reason.statusCode === 403) {
    throw new ForbiddenError('This email is restricted. Please contact us for details.', 'email');
  }

  throw new AuthFailedError('Error on auth server', reason.statusCode);
}

service.validateToken = async function validateToken(token) {
  console.log('Validating access token');

  const options = {
    url: `${config.get('auth2Server.host')}/oauth/authenticate`,
    json: true,
    headers: {
      Authorization: token,
    },
    method: 'GET',
  };

  return request(options).catch((reason) => {
    console.log('Token validation failed.');
    authErrorHandler(reason);
  });
};

service.registerUser = async function registerUser(email, password, userId) {
  console.log('Creating a new user on auth server');

  const options = {
    url: `${config.get('auth2Server.host')}/oauth/register`,
    json: true,
    method: 'POST',
    body: {
      email,
      password,
      userId,
    },
  };

  return request(options).catch((reason) => {
    console.log('Registration with auth server failed.');
    authErrorHandler(reason);
  });
};

service.loginUser = async function loginUser(email, password) {
  console.log('Logging in user');

  const options = {
    url: `${config.get('auth2Server.host')}/oauth/login`,
    json: true,
    method: 'POST',
    body: {
      email,
      password,
    },
  };

  return request(options).catch((reason) => {
    console.log('Failed to login.');
    authErrorHandler(reason);
  });
};

module.exports = service;
