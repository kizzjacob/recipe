const { users: { add, edit: { bio, picture } } } = require('../../queries');

module.exports = {
  addUser: async (req, res, next) => {
    try {
      const result = await add(req.payload);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  editBio: async (req, res, next) => {
    try {
      const { username } = req.params;
      const { bio } = req.payload;
      const result = await bio(username, bio);
      if (!result) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  editPicture: async (req, res, next) => {
    try {
      const { username } = req.params;
      const { picture } = req.payload;
      const result = await picture(username, picture);
      if (!result) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}