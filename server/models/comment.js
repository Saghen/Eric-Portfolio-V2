'use strict';

const C = require('../core/constants');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let isEmpty = function (property) {
  return property.length;
};

let CommentSchema = new Comment(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: {
      type: String,
      required: true,
      trim: true,
      validate: [isEmpty, 'Please fill in the content']
    },
    datePosted: {
      type: Date,
      default: Date.now()
    }
  }
);

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;