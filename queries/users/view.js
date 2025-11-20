const { 
  models: { user: { User, Connection } }
} = require('../../models');

const { convertToNumber } = require('../../utils/feed');

module.exports = {
  // Get user by username
  byUsername: async username => {
    return await User.findOne({ where: { username } });
  },

  // Get user's followers
  followers: async (username, page = 1, limit = 10) => {
    const offset = (convertToNumber(page, 'page') - 1) * convertToNumber(limit, 'limit');
    return await Connection.findAndCountAll({
      where: { to: username },
      offset,
      limit: convertToNumber(limit, 'limit'),
      order: [['createdAt', 'DESC']]
    });
  },

  // Get user's following
  following: async (username, page = 1, limit = 10) => {
    const offset = (convertToNumber(page, 'page') - 1) * convertToNumber(limit, 'limit');
    return await Connection.findAndCountAll({
      where: { from: username },
      offset,
      limit: convertToNumber(limit, 'limit'),
      order: [['createdAt', 'DESC']]
    });
  }
};
