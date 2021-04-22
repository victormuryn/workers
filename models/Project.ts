import {Document, model, Model, Schema, Types} from 'mongoose';

import {UserType} from './User';
import {CategoryType} from './Category';
import {BetType} from './Bet';

export interface ProjectType extends Document {
  price: number,
  views: number,
  date: Date,
  hot: boolean,
  expire: Date,
  title: string,
  remote: boolean,
  description: string,
  author: UserType['_id'],
  bets: Array<BetType['_id']>,
  category: CategoryType['_id'],
  location: {
    city: string,
    region: string,
    district: string,
    latitude: number,
    longitude: number,
  }
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
  category: {type: Types.ObjectId, ref: `Category`, required: true},
  location: {
    city: {
      type: String,
      default: ``,
    },
    region: {
      type: String,
      default: ``,
    },
    district: {
      type: String,
      default: ``,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
  },
  // tags: {type: Types.ObjectId}
});

export default model<ProjectType>(`Project`, schema);
