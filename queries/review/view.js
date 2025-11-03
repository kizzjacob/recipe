const { 
  models: { recipe: { Review } }
} = require('../../models');

const { convertToNumber } = require('../../utils/feed');

module.exports = {
  // Get review by recipe and user
  byRecipeAndUser: async (recipe, user) => {
    return await Review.findOne({ where: { recipe, user } });
  },

  // Get reviews for a recipe
  byRecipe: async (recipe, page = 1, limit = 10) => {
    const offset = (convertToNumber(page, 'page') - 1) * convertToNumber(limit, 'limit');
    return await Review.findAndCountAll({
      where: { recipe },
      offset,
      limit: convertToNumber(limit, 'limit'),
      order: [['createdAt', 'DESC']]
    });
  },

  // Get user reviews
  byUser: async (user, page = 1, limit = 10) => {
    const offset = (convertToNumber(page, 'page') - 1) * convertToNumber(limit, 'limit');
    return await Review.findAndCountAll({
      where: { user },
      offset,
      limit: convertToNumber(limit, 'limit'),
      order: [['createdAt', 'DESC']]
    });
  }
};
