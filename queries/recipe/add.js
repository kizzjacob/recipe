const { 
  models: { recipe: { Recipe } } 
}  = require('../../models');

// const add = async data => {
//   try {
//     const recipe = await Recipe.create(data);
//     return recipe;
//   } catch (error) {
//     console.error('Error adding recipe:', error);
//     throw error;
//   }
// };

module.exports = async data => {
  return await Recipe.create(data);
};