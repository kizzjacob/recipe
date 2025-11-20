const { 
  models: { recipe: { Recipe } } 
}  = require('../../models');

module.exports = {
  name: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ name: value });
    return recipe;
  },
  desc: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ desc: value });
    return recipe;
  },
  video: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ video: value });
    return recipe;
  },
  images: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ images: value });
    return recipe;
  },
  tags: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ tags: value });
    return recipe;
  }
}