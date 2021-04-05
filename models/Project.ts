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

export interface ProjectFull extends ProjectType {
  author: UserType,
  betsCount: number,
  bets: Array<BetType>,
  category: CategoryType,
}

export interface ProjectPreview {
  date: Date,
  hot: boolean,
  title: string,
  price: number,
  remote: boolean,
  betsCount: number,
  category: CategoryType,
  location: {
    city: string,
    region: string,
    district: string,
    latitude: number,
    longitude: number,
  }
}

export interface ProjectModel extends Model<ProjectType> {
  getFullProject(id: string): Promise<ProjectFull>,
  getPreviews(start: number, count: number): Promise<Array<ProjectPreview>>,
}

const schema = new Schema<ProjectType, ProjectModel>({
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
}, {
  toObject: {virtuals: true},
  toJSON: {virtuals: true},
});

schema
  .virtual(`betsCount`)
  .get(function(this: ProjectType) {
    return this.bets.length;
  });

// Static methods
schema.statics.getFullProject = function(
  this: Model<ProjectType>,
  id: string,
) {
  return this
    .findById(id)
    .populate(`bets`)
    .populate(
      `author`,
      `_id name surname username image location.city location.country`,
    )
    .populate(`category`)
    .exec();
};

schema.statics.getPreviews = function(
  this: Model<ProjectType>,
  start: number,
  count: number,
) {
  return this
    .find({})
    .populate(`category`)
    .select(`title price date hot location remote category betsCount`)
    .sort({date: -1})
    .exec();
};

export default model<ProjectType, ProjectModel>(`Project`, schema);
