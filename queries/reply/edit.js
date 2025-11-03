const { 
  models: { recipe: { Reply } }
} = require('../../models');

module.exports = {
  content: async (hex, value) => {
    const reply = await Reply.findOne({ where: { hex } });
    if (!reply) return null;
    return await reply.update({ content: value });
  },

  images: async (hex, value) => {
    const reply = await Reply.findOne({ where: { hex } });
    if (!reply) return null;
    return await reply.update({ images: value });
  }
};
