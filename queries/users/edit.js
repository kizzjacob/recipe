const { 
  models: { user: { User } }
} = require('../../models');

const { auth: { password: { hash } } } = require('../../utils');

module.exports = {
  // Update basic info
  info: async (username, data) => {
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    return await user.update(data);
  },

  // Update password
  password: async (username, password) => {
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    const hashedPassword = await hash(password);
    return await user.update({ password: hashedPassword });
  },

  // Update picture
  picture: async (username, picture) => {
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    return await user.update({ picture });
  },

  // Update bio
  bio: async (username, bio) => {
    const user = await User.findOne({ where: { username } });
    if (!user) return null;
    return await user.update({ bio });
  }
};
