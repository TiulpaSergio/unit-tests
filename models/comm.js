const mongoose = require('mongoose');
const User = require('./users.js');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  username: String, 
});

commentSchema.pre('save', async function (next) {
  try {
    const user = await User.findById(this.user);
    if (user) {
      this.username = user.username;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
