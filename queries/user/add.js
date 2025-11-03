const { 
  models: { user: { User } }
} = require('../../models');

const { auth: { password: { hash } } } = require('../../utils');

module.exports = async data => {
  // Hash the password before creating user
  data.password = await hash(data.password);
  return await User.create(data);
};
