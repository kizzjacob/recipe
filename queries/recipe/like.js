const {
  models: { recipe: { Like } }
} = require('../../models');

// const like = async (recipe, user) => {
//   return await Like.create({ recipe, user });
// };

module.exports = async (recipe, user) => {
  return await Like.create({ recipe, user });
};