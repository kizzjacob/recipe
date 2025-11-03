const{
models:{recipe:{Review}}
} = require('../../models/recipe');

module.exports = async (hex, user, rating, content) => {
  const review = await Review.create({ recipe: hex, user, rating, content });
  return review;
};