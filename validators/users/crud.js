const { validate } = require('../validator');

// Desc: Generate a 13+3 character long hash
const generateHex = prefix => {
  const data = `${Date.now()}-${Math.random()}`;
  let hash = crypto.createHash('sha256').update(data).digest('hex');
  return (prefix + hash.slice(0, 13)).toUpperCase();
};

const userSchema = {
  username: { type: 'string', required: true },
  phone: { type: 'phone', required: true },
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }, // Changed to optional
  gender: { type: 'enum', values: ['male', 'female', 'other'], required: true },
  role: { type: 'enum', values: ['user', 'chef'], required: false },
  dob: { type: 'date', required: true },
  password: { type: 'password', required: true },
}

// Validator: validates a new user before saving it to the database
const create = async data => {
  data.username = generateHex('U0C');
  data.email = data.email.toLowerCase();
  data.gender = data.gender.toLowerCase();
  return await validate(data, userSchema);
}


// edit user bio
const bio = async data => {
  const schema = {
    bio: { type: 'string', required: false }
  }
  return await validate(data, schema);
}

// edit user picture
const picture = async data => {
  const schema = {
    picture: { type: 'string', required: false }
  }
  return await validate(data, schema);
}

// Validate: validate the user exists: email or name
const exists = async data => {
  const schema = {
    email: { type: 'email', required: true },
    phone: { type: 'phone', required: true }
  }
  return await validate(data, schema);
}

// Validate: validate the user login
const login = async data => {
  data.identity = data.identity.toLowerCase();

  const schema = {
    email: { type: 'email', required: true },
    password: { type: 'string', required: true }  // Use 'string' instead of 'password' for login
  }

  return await validate(data, schema);
}

// Validate: validate the user date of birth
const dob = async data => {
  const schema = {
    dob: { type: 'dob', required: true }
  }
  return await validate(data, schema);
}

// Validate: validate the user password
const password = async data => {
  const schema = {
    password: { type: 'password', required: true }
  }
  return await validate(data, schema);
}

module.exports = { create, login, exists, edit: { bio, picture, password, dob } };