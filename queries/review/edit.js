const { 
  models: { recipe: { Review } }
} = require('../../models');

module.exports = {
  rating: async (recipe, user, value) => {
    const review = await Review.findOne({ where: { recipe, user } });
    if (!review) return null;
    return await review.update({ rating: value });
  },

  comment: async (recipe, user, value) => {
    const review = await Review.findOne({ where: { recipe, user } });
    if (!review) return null;
    return await review.update({ comment: value });
  }
};
