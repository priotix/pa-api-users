const Router = require('koa-router');

const userCtrl = require('../controllers/user-controller');

const setupAuthorization = require('../../libs/auth');

const authorize = setupAuthorization();

const userRouter = new Router();

userRouter.get(
  '/users/me',
  authorize,
  userCtrl.getProfile,
);

module.exports = userRouter;
