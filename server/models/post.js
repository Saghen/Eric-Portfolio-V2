'use strict';

const C = require('Constants');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

let isEmpty = function(property) {
  return property.length;
};

let PostSchema = new Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 120,
    validate: [isEmpty, 'Please fill in the title']
  },
  description: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 400,
    validate: [isEmpty, 'Please fill in the description']
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate: [isEmpty, 'Please fill in the image link']
  },
  content: {
    type: String,
    required: true,
    trim: true,
    validate: [isEmpty, 'Please fill in the content']
  },
  topic: {
    type: String,
    enum: C.topics,
    default: C.topics[0]
  },
  comments: {
    type: [{ body: String, date: Date }],
    default: []
  },
  date: {
    type: Date,
    default: Date.now()
  },
  hidden: {
    type: Boolean,
    default: false
  },
  draft: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
});

PostSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Post' });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
