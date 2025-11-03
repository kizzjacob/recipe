const { 
  models: { recipe: { Response } }
} = require('../../models');

module.exports = async hex => {
  const response = await Response.findOne({ where: { hex } });
  if (!response) return null;
  await response.destroy();
  return true;
};
