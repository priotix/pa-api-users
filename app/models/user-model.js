const bluebird = require('bluebird');
const mongoose = require('mongoose');

const Mongoose = bluebird.promisifyAll(mongoose);

const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
});

// never include sensitive information in JSON output
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    const {
      _id,
      __v,
      ...trans
    } = ret;

    return { id: doc.get('_id'), ...trans };
  },
});

// package user model
let UserModel;

UserSchema.statics.emailExists = async function emailExists(email) {
  const count = await UserModel.count({ email });
  return count > 0;
};

UserSchema.statics.getUserByEmail = async function getUserByEmail(email) {
  return UserModel.findOne({ email });
};

UserSchema.statics.createUser = async function createUser(userData) {
  const user = new UserModel(userData);
  await user.save();

  return user;
};

UserModel = Mongoose.model('User', UserSchema);

module.exports = {
  UserSchema,
  UserModel,
};
