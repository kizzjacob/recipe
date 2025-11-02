const { 
  models: { recipe: { Recipe } } 
}  = require('../../models');

module.exports = {
  name: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ name: value });
  },
  desc: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ desc: value });
  },
  video: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ video: value });
  },
  images: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ images: value });
  },
  tags: async (hex, value) => {
    const recipe = await Recipe.findOne({ where: { hex } });
    if(!recipe) return null;
    await recipe.update({ tags: value });
  }
}