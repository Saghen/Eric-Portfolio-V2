'use strict';

const C = require('Constants');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

let isEmpty = function (property) {
  return property.length;
};

let PostSchema = new Schema(
  {
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
    content: {
      type: toString,
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
      type: {
        type: String,
        enum: C.topics
      },
      default: C.topics[0]
    },
    comments: [{ body: String, date: Date }],
    date: {
      type: Date,
      default: Date.now()
    },
    hidden: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    }
  }
);

PostSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Post' })

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;