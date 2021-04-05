import {Document, Schema, model, Types} from 'mongoose';

import {UserType} from './User';
import Project, {ProjectType} from './Project';

export interface BetType extends Document {
  date: Date,
  term: number,
  text: string,
  price: number,
  author: UserType['_id'],
  project: ProjectType['_id'],
  updated: {
    count: number,
    lastDate: Date,
  }
}

const schema = new Schema<BetType>({
  date: {type: Date, required: true},
  term: {type: Number, required: true},
  text: {type: String, required: true},
  price: {type: Number, required: true},
  author: {type: Types.ObjectId, ref: `User`, required: true},
  project: {type: Types.ObjectId, ref: `Project`, required: true},
  updated: {
    count: {
      default: 0,
      type: Number,
    },
    lastDate: {
      type: Date,
    },
  },
});

schema.pre<BetType>(`save`, async function() {
  if (this.isNew) {
    Project.findById(this.project, (err: Error, project: ProjectType) => {
      if (err) throw err;
      project.bets.push(this._id);
      project.save();
    });
  }
});

export default model<BetType>(`Bet`, schema);
