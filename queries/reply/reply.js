const { 
  models: { recipe: { Reply } }
} = require('../../models');

const { hex: { hash } } = require('../../utils');

module.exports = async (recipe, response, reply, user, content, mention = null, images = null) => {
  return await Reply.create({
    hex: await hash('0xr'),
    recipe,
    response,
    reply,
    user,
    mention,
    content,
    images
  });
};
