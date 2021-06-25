const { UserModel } = require('../../app/models/user-model');

const controller = {};
module.exports = controller;

controller.getProfile = async (ctx) => {
  const userEmail = ctx.state.identity.email;

  const user = await UserModel.getUserByEmail(userEmail);

  ctx.status = 200;
  ctx.body = user;
};
