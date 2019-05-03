const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TopicSchema = new Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  }
})

let Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;