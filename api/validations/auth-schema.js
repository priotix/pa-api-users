const Joi = require('joi');
const config = require('config');

const schemes = {};

schemes.register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().regex(new RegExp(config.get('auth.nameRegExp')), 'valid firstName').required(),
    lastName: Joi.string().regex(new RegExp(config.get('auth.nameRegExp')), 'valid lastName').required(),
    password: Joi.string().regex(new RegExp(config.get('auth.passwordRegExp')), 'valid password').required(),
  }),
};

schemes.login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

module.exports = schemes;
