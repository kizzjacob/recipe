const { models: { recipe: { Recipe } } } = require('../../models')

// Query: search a recipe by query string
module.exports = (query, user, page, limit) => {
	const offset = (page - 1) * limit;
	const queryStr = query.trim().split(' ').map((q) => `${q.toLowerCase()}:*`).join(' | ');
	const options = { user: user ? user.toUpperCase() : null, query: queryStr, offset, limit };
	
	return Recipe.search(options);
}  