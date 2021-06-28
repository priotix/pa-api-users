const request = require('request-promise');
const config = require('config');
const StorageFailedError = require('../libs/errors/services/storage-service-failure-error');
const MultiValidationError = require('../libs/errors/validation/multi-validate-error');
const NotFoundError = require('../libs/errors/not-found-error');

const service = {};

function storageErrorHandler(reason) {
  const { message, errors } = reason.response.body;

  if (reason.statusCode === 409) {
    throw new MultiValidationError(message, errors);
  }

  if (reason.statusCode === 404) {
    throw new NotFoundError(message, reason.statusCode);
  }

  throw new StorageFailedError('Error on auth server', reason.statusCode);
}

service.createNewUser = async function createNewUser(userId) {
  console.log('Creating a new user on auth server');

  const options = {
    url: `${config.get('apiStorage.host')}/api/users`,
    json: true,
    method: 'POST',
    body: { userId },
    headers: {
      Authorization: config.get('apiStorage.authKey'),
    },
  };

  return request(options).catch((reason) => {
    console.log('Registration with auth server failed.');
    storageErrorHandler(reason);
  });
};

module.exports = service;
