import { Document, Model, model, Schema } from 'mongoose'

let Comment: Schema = new Schema({
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
});

interface IComment extends Document {
  postedBy: Schema.Types.ObjectId,
  content: String,
  datePosted: Date
}

let CommentModel: Model<IComment> = model<IComment>('Comment', CommentSchema);

export = CommentModel;