const { 
  models: { user: { Connection } }
} = require('../../models');

module.exports = {
  // Follow a user
  follow: async (from, to) => {
    return await Connection.create({ from, to });
  },

  // Unfollow a user
  unfollow: async (from, to) => {
    const connection = await Connection.findOne({ where: { from, to } });
    if (!connection) return null;
    await connection.destroy();
    return true;
  }
};
