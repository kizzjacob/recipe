const { 
  models: { recipe: { Reply } }
} = require('../../models');

module.exports = async hex => {
  const reply = await Reply.findOne({ where: { hex } });
  if (!reply) return null;
  await reply.destroy();
  return true;
};
