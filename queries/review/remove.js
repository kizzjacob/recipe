const { 
  models: { recipe: { Review } }
} = require('../../models');

module.exports = async (recipe, user) => {
  const review = await Review.findOne({ where: { recipe, user } });
  if (!review) return null;
  await review.destroy();
  return true;
};
