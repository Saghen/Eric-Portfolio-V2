import { Document, Model, model, Schema } from 'mongoose'

import * as C from 'Constants';

let TopicSchema: Schema = new Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  }
});

interface ITopic extends Document {
  topic: String
}

let TopicModel: Model<ITopic> = model<ITopic>('Topic', TopicSchema);

export = TopicModel;