const { 
  models: { recipe: { Reply } }
} = require('../../models');

const { hex: { hash } } = require('../../utils');

module.exports = async (recipe, response, user, content, images = null) => {
  return await Reply.create({
    hex: await hash('0xr'),
    recipe,
    response,
    user,
    content,
    images,
    kind: 'response'
  });
};
