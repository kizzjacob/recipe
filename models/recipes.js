const {
  reply: replyHook, response: responseHook,
  review: reviewHook, view: viewHook, like: likeHook
} = require('../hooks');

module.exports = (sequelize, Sequelize, User) => {
  const { INTEGER, STRING, DATE, ENUM, TEXT, ARRAY } = Sequelize;

  const Recipe = sequelize.define("recipes", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    hex: { type: STRING(32), unique: true, allowNull: false },
    chef: { type: STRING(30), allowNull: false, references: { model: User, key: 'username' } },
    name: { type: STRING(500), allowNull: false },
    description: { type: TEXT, allowNull: true },
    video: { type: STRING(1000), allowNull: true },
    images: { type: ARRAY(STRING(1000)), allowNull: true },
    tags: { type: ARRAY(STRING(100)), allowNull: true },
    reviews: { type: INTEGER, defaultValue: 0 },
    views: { type: INTEGER, defaultValue: 0 },
    likes: { type: INTEGER, defaultValue: 0 },
    responses: { type: INTEGER, defaultValue: 0 }
  }, {
    timestamps: true,
    tableName: 'recipes',
    indexes: [
      { unique: true, fields: ['hex'] }, { fields: ['chef'] }, { fields: ['name'] },
      { fields: ['reviews'] }, { fields: ['views'] }, { fields: ['likes'] },
      { fields: ['tags'], using: 'gin' }, { fields: ['responses'] }, { fields: ['createdAt'] }
    ],
    hooks: {
      afterCreate: async (recipe, options) => {
        await User.increment('recipes', { by: 1, where: { username: recipe.chef }, transaction: options.transaction });
      },
      afterDestroy: async (recipe, options) => {
        await User.decrement('recipes', { by: 1, where: { username: recipe.chef }, transaction: options.transaction });
      }
    }
  });


  // add after sync hook to search column tsvector and create the GIN index
	Recipe.afterSync(async () => {
		// Run the raw SQL query to add the `ts` column
		await sequelize.query(/* SQL */`ALTER TABLE recipes ADD COLUMN IF NOT EXISTS search TSVECTOR
			GENERATED ALWAYS AS(setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(description, '')), 'B')) STORED;
		`);

		// create the GIN index for the full_search column
		sequelize.query(`CREATE INDEX IF NOT EXISTS search_recipes_idx ON recipes USING GIN(search)`);
	});

  // add search property to the recipe model
	Recipe.search = async options => {
		const { user, query, offset, limit } = options;
		// check if the user is not null
		if (user !== null) {
			return await sequelize.query(/*sql*/`
    		SELECT r.id, r.hex, r.chef, r.name, r.description, r.video, r.images, r.tags, r.reviews, r.views, r.likes, r.responses, r."createdAt", r."updatedAt",
        	COALESCE(l.liked, false) AS liked, COALESCE(v.viewed, false) AS viewed, ts_rank_cd(r.search, to_tsquery('english', '${query}')) AS rank, COALESCE(r.chef = :user, false) AS you,
        	JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'name', u.name, 'picture', u.picture, 'bio', u.bio, 'followers', u.followers, 'following', u.following, 'recipes', u.recipes, 'reviews', u.reviews, 'role', u.role) AS author
        FROM recipes r
        LEFT JOIN users u ON r.chef = u.username
        LEFT JOIN (SELECT recipe, true AS liked FROM likes WHERE "user" = :user) AS l ON r.hex = l.recipe
        LEFT JOIN (SELECT recipe, true AS viewed FROM views WHERE "user" = :user) AS v ON r.hex = v.recipe
        WHERE to_tsvector('english', r.name || ' ' || COALESCE(r.description, '')) @@ to_tsquery('english', :query)
        ORDER BY rank DESC, r."createdAt" DESC
        LIMIT :limit
        OFFSET :offset;
			`, { replacements: { user, query, offset, limit }, type: sequelize.QueryTypes.SELECT });
		} else {
			return await sequelize.query(/*sql*/`
        SELECT r.id, r.hex, r.chef, r.name, r.description, r.video, r.images, r.tags, r.reviews, r.views, r.likes, r.responses, r."createdAt", r."updatedAt",
        	false AS liked, false AS viewed, ts_rank_cd(r.search, to_tsquery('english', '${query}')) AS rank, false AS you,
        	JSON_BUILD_OBJECT('id', u.id, 'username', u.username, 'name', u.name, 'picture', u.picture, 'bio', u.bio, 'followers', u.followers, 'following', u.following, 'recipes', u.recipes, 'reviews', u.reviews, 'role', u.role) AS author
        FROM recipes r
    		LEFT JOIN users u ON r.chef = u.username
        WHERE to_tsvector('english', r.name || ' ' || COALESCE(r.description, '')) @@ to_tsquery('english', :query)
        ORDER BY rank DESC, r."createdAt" DESC
        LIMIT :limit
    		OFFSET :offset;
			`, { replacements: {query, offset, limit }, type: sequelize.QueryTypes.SELECT });
		}
	}

  // Ingredients table
  const Ingredient = sequelize.define("ingredients", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    name: { type: STRING(200), allowNull: false },
    quantity: { type: STRING(100), allowNull: true },
    unit: { type: STRING(50), allowNull: true },
    descriptor: { type: STRING(1000), allowNull: true }
  }, {
    timestamps: true,
    tableName: 'ingredients',
    indexes: [
      { fields: ['recipe'] }, { fields: ['name'] }, { fields: ['quantity'] },
      { fields: ['unit'] }, { fields: ['descriptor'] }, { fields: ['createdAt'] }
    ]
  });

  // instructions table
  const Instruction = sequelize.define("instructions", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    step: { type: INTEGER, allowNull: false },
    description: { type: TEXT, allowNull: false },
    image: { type: STRING(1000), allowNull: true }
  }, {
    timestamps: true,
    tableName: 'instructions',
    indexes: [
      { fields: ['recipe'] }, { fields: ['step'] }, { fields: ['createdAt'] }
    ]
  });

  // Reviews table
  const Review = sequelize.define("reviews", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    user: { type: STRING(30), allowNull: false, references: { model: User, key: 'username' } },
    rating: { type: INTEGER, allowNull: false },
    comment: { type: TEXT, allowNull: true }
  }, {
    timestamps: true,
    tableName: 'reviews',
    indexes: [
      { fields: ['recipe'] }, { fields: ['user'] }, { fields: ['rating'] }, { fields: ['createdAt'] },
      { unique: true, fields: ['recipe', 'user'] }
    ],
    hooks: {
      afterCreate: async (review, options) => {
        await reviewHook.review(review, options, Recipe, User);
      },
      afterDestroy: async (review, options) => {
        await reviewHook.remove(review, options, Recipe, User);
      }
    }
  });

  // Views table
  const View = sequelize.define("views", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    user: { type: STRING(30), allowNull: true, references: { model: User, key: 'username' } },
    kind: { type: ENUM('guest', 'user', 'bot'), defaultValue: 'guest' },
    country: { type: STRING(100), allowNull: true },
    region: { type: STRING(100), allowNull: true },
    ip: { type: STRING(45), allowNull: false }
  }, {
    timestamps: true,
    tableName: 'views',
    indexes: [
      { fields: ['recipe'] }, { fields: ['user'] }, { fields: ['ip'] }, { fields: ['createdAt'] }
    ],
    hooks: {
      afterCreate: async (view, options) => {
        await viewHook.view(view, options, Recipe);
      },
      beforeCreate: async (view, options) => {
        await viewHook.before(view, options, View);
      }
    }
  });

  // Responses table:
  const Response = sequelize.define("responses", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    hex: { type: STRING(32), unique: true, allowNull: false },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    user: { type: STRING(30), allowNull: false, references: { model: User, key: 'username' } },
    replies: { type: INTEGER, defaultValue: 0 },
    images: { type: ARRAY(STRING(1000)), allowNull: true },
    content: { type: TEXT, allowNull: false }
  }, {
    timestamps: true,
    tableName: 'responses',
    indexes: [
      { unique: true, fields: ['hex'] },
      { fields: ['recipe'] }, { fields: ['user'] }, { fields: ['createdAt'] }
    ],
    hooks: {
      afterCreate: async (response, options) => {
        await responseHook.respond(response, options, Recipe);
      },
      afterDestroy: async (response, options) => {
        await responseHook.remove(response, options, Recipe);
      }
    }
  });

  // Reply table
  const Reply = sequelize.define("replies", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    hex: { type: STRING(32), unique: true, allowNull: false },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    response: { type: Sequelize.STRING(32), allowNull: true, references: { model: Response, key: 'hex' } },
    reply: { type: Sequelize.STRING(32), allowNull: true, references: { model: 'replies', key: 'hex' } },
    user: { type: STRING(30), allowNull: false, references: { model: User, key: 'username' } },
    mention: { type: STRING(30), allowNull: true, references: { model: User, key: 'username' } },
    replies: { type: INTEGER, defaultValue: 0 },
    images: { type: ARRAY(STRING(1000)), allowNull: true },
    kind: { type: ENUM('response', 'reply'), allowNull: false },
    content: { type: TEXT, allowNull: false }
  }, {
    timestamps: true,
    tableName: 'replies',
    indexes: [
      { unique: true, fields: ['hex'] },
      { fields: ['response'] }, { fields: ['user'] }, { fields: ['kind'] }, { fields: ['createdAt'] },
    ],
    hooks: {
      afterCreate: async (reply, options) => {
        await replyHook.reply(reply, options, Response, Reply);
      },
      afterDestroy: async (reply, options) => {
        await replyHook.remove(reply, options, Response, Reply);
      }
    }
  });

  // Likes table
  const Like = sequelize.define("likes", {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    recipe: { type: STRING(32), allowNull: false, references: { model: Recipe, key: 'hex' } },
    user: { type: STRING(30), allowNull: false, references: { model: User, key: 'username' } }
  }, {
    timestamps: true,
    tableName: 'likes',
    indexes: [
      { unique: true, fields: ['recipe', 'user'] }, { fields: ['recipe'] }, { fields: ['user'] },
      { fields: ['createdAt'] }
    ]
  });

  return { Recipe, Ingredient, Instruction, Review, Response, Reply, View, Like };
}
