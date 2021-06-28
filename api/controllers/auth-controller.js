const { UserModel } = require('../../app/models/user-model');

const authService = require('../../services/auth-service');
const storageService = require('../../services/storage-service');

const ResourceExistsError = require('../../libs/errors/validation/resource-exists-error');
const AuthenticationError = require('../../libs/errors/auth/authentication-error');

const controller = {};
module.exports = controller;

controller.register = async (ctx) => {
  const reqData = ctx.request.body;

  console.log(`Creating user ${reqData.email}`);

  if (await UserModel.emailExists(reqData.email)) {
    throw new ResourceExistsError(`E-mail ${reqData.email} already exists`, 'email');
  }

  await authService.registerUser(reqData.email, reqData.password);
  const user = await UserModel.createUser(reqData);
  await storageService.createNewUser(user._id);

  console.log(`User created ${user.email}`);

  ctx.status = 202;
  ctx.body = user;
};

controller.login = async (ctx) => {
  const { email, password } = ctx.request.body;

  const user = await UserModel.getUserByEmail(email);
  if (!user) {
    throw new AuthenticationError();
  }

  const authData = await authService.loginUser(user.email, password);

  ctx.status = 200;
  ctx.body = {
    ...authData,
  };
};
