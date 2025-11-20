const { users: { crud } } = require('../validators');


const validateCreateUser = async (req, res, next) => {
  try {
    req.payload  = await crud.create(req.body);
    next();
  } catch (error) {
    res.status(400).json({  success: false, error: error.message });
  }
};

const validateUserBio = async (req, res, next) => {
  try {
    req.payload  = await crud.edit.bio(req.body);
    next();
  } catch (error) {
    res.status(400).json({  success: false, error: error.message });
  }
};

const validateUserPicture = async (req, res, next) => {
  try {
    req.payload  = await crud.edit.picture(req.body);
    next();
  } catch (error) {
    res.status(400).json({  success: false, error: error.message });
  }
};

const validateUserPassword = async (req, res, next) => {
  try {
    req.payload  = await crud.edit.password(req.body);
    next();
  } catch (error) {
    res.status(400).json({  success: false, error: error.message });
  }
};

const validateUserDateOfBirth = async (req, res, next) => {
  try {
    req.payload  = await crud.edit.dob(req.body);
    next();
  } catch (error) {
    res.status(400).json({  success: false, error: error.message });
  }
};


module.exports = {
  validateCreateUser,
  validateUserBio,
  validateUserPicture,
  validateUserPassword,
  validateUserDateOfBirth
};