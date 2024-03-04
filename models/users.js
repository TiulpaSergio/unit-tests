const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  address: {
    type: String,
  },
  website: {
    type: String,
  },
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
