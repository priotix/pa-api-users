const Router = require('koa-router');
const authCtrl = require('../controllers/auth-controller');
const authSchema = require('../validations/auth-schema');
const validate = require('../../libs/validate');

const authRouter = new Router();

// register a new user
authRouter.post(
  '/auth/register',
  validate(authSchema.register),
  authCtrl.register,
);

// login
authRouter.post(
  '/auth/login',
  validate(authSchema.login),
  authCtrl.login,
);

module.exports = authRouter;
