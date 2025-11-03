const { 
  models: { user: { User } }
} = require('../../models');

module.exports = async username => {
  const user = await User.findOne({ where: { username } });
  if (!user) return null;
  await user.destroy();
  return true;
};
