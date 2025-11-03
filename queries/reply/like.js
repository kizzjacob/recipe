const { 
  models: { recipe: { Like } }
} = require('../../models');

module.exports = async (recipe, user) => {
  return await Like.create({ recipe, user });
};
