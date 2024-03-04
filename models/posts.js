const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: { 
    type: String,
    required: true 
  },
  content: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  commentsCount: {
    type: Number,
    default: 0, 
  }
});

const Post = mongoose.model('posts', postSchema);

module.exports = Post;
