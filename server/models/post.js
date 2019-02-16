'use strict';

const C = require('../core/constants');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let isEmpty = function (property) {
  return property.length;
};

let PostSchema = new Schema(
  {
    author: require('./user'),
    title: {
      type: String,
      required: true,
      trim: true,
      validate: [isEmpty, 'Please fill in the title']
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: [isEmpty, 'Please fill in the image link']
    },
    previewContent: {
      type: String,
      required: true,
      trim: true,
      validate: [isEmpty, 'Please fill in the preview content']
    },
    topic: {
      type: [
        {
          type: String,
          enum: C.topics
        }
      ],
      default: [C.topics[0]]
    },
    comments: {
      type: [ require('./comment') ],
      default: []
    },
    datePosted: {
      type: Date,
      default: Date.now()
    }
  }
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;