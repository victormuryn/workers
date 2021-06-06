import {Document, Schema, model, Types} from 'mongoose';

import {UserType} from './User';

export interface ChatType {
  date: Date,
  from: UserType['_id'],
  to: UserType['_id'],
  content: string,
  read: boolean,
}

export interface ChatDocument extends ChatType, Document {}

const schema = new Schema<ChatDocument>({
  date: {type: Date, required: true},
  read: {type: Boolean, default: false},
  content: {type: String, required: true},
  to: {type: Types.ObjectId, ref: `User`, required: true},
  from: {type: Types.ObjectId, ref: `User`, required: true},
});

export default model<ChatDocument>(`Chat`, schema);
