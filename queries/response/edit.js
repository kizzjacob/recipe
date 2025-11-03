const { 
  models: { recipe: { Response } }
} = require('../../models');

module.exports = {
  content: async (hex, value) => {
    const response = await Response.findOne({ where: { hex } });
    if (!response) return null;
    return await response.update({ content: value });
  },

  images: async (hex, value) => {
    const response = await Response.findOne({ where: { hex } });
    if (!response) return null;
    return await response.update({ images: value });
  }
};
