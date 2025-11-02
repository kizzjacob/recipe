const { 
  models: { recipe: { Response } }
} =  require('../../models');

module.exports = async (recipe, user, content) => {
  return await Response.create({ recipe, user, content });
};