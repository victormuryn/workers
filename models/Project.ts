import {Document, model, Schema, Types} from 'mongoose';

import {UserType} from './User';
import {CategoryType} from './Category';
import {BetType} from './Bet';
import {CityDocument} from './City';

export interface ProjectType extends Document {
  date: Date,
  expire: Date,
  hot: boolean,
  title: string,
  price: number,
  views: number,
  remote: boolean,
  description: string,
  author: UserType['_id'],
  bets: Array<BetType['_id']>,
  location: CityDocument['_id'],
  category: Array<CategoryType['_id']>,
}

const schema = new Schema<ProjectType>({
  price: {type: Number, default: 0},
  views: {type: Number, default: 0},
  date: {type: Date, required: true},
  hot: {type: Boolean, default: false},
  expire: {type: Date, required: true},
  title: {type: String, required: true},
  remote: {type: Boolean, default: false},
  description: {type: String, required: true},
  bets: [{type: Types.ObjectId, ref: `Bet`, required: true}],
  author: {type: Types.ObjectId, ref: `User`, required: true},
  location: {type: Types.ObjectId, ref: `City`, default: null},
  category: [{type: Types.ObjectId, ref: `Category`, required: true}],
});

export default model<ProjectType>(`Project`, schema);
