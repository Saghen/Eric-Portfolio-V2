import { Document, Model, model, Schema } from 'mongoose'

let Post: Schema = new Schema({
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
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
});

interface IPost extends Document {
  postedBy: mongoose.Schema.Types.ObjectId,
  title: String,
  image: String,
  content: String,
  previewContent: String,
  topic: String,
  comments: [{ body: String, date: Date }],
  date: Date,
  hidden: Boolean,
  views: Number,
}

let PostModel: Model<IPost> = model<IPost>('Post', PostSchema);

export = PostModel;