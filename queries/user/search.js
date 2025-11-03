const { 
  models: { user: { User } },
  db: { Sequelize: { Op } }
} = require('../../models');

const { convertToNumber } = require('../../utils/feed');

module.exports = {
  // Search users by username or name
  byQuery: async (query, page = 1, limit = 10) => {
    const offset = (convertToNumber(page, 'page') - 1) * convertToNumber(limit, 'limit');
    return await User.findAndCountAll({
      where: {
        [Op.or]: [
          { username: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } }
        ]
      },
      offset,
      limit: convertToNumber(limit, 'limit'),
      order: [['createdAt', 'DESC']]
    });
  },

  // Search users by role
  byRole: async (role, page = 1, limit = 10) => {
    const offset = (convertToNumber(page, 'page') - 1) * convertToNumber(limit, 'limit');
    return await User.findAndCountAll({
      where: { role },
      offset,
      limit: convertToNumber(limit, 'limit'),
      order: [['createdAt', 'DESC']]
    });
  }
};
