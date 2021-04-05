import {Document, Schema, model, Types, Model} from 'mongoose';

import {CategoryType} from './Category';
import bcrypt from 'bcrypt';

export interface UserType extends Document{
  cv: string,
  name: string,
  online: Date,
  quote: string,
  email: string,
  phone: string,
  image: boolean,
  rating: number,
  surname: string,
  finished: number,
  password: string,
  username: string,
  categories: Array<CategoryType['_id']>,
  accountType: `freelancer` | `client`,
  location: {
    city: string,
    region: string,
    country: string,
    latitude: number,
    longitude: number,
  },
  social: {
    twitter: string,
    github: string,
    website: string,
    instagram: string,
    facebook: string,
  }
}

export interface UserFull extends UserType {
  categories: Array<CategoryType>,
}

export interface UserModel extends Model<UserType> {
  getAllData(id: string): Promise<UserFull>
}

const schema = new Schema<UserType, UserModel>({
  cv: {type: String, default: ``},
  quote: {type: String, default: ``},
  rating: {type: Number, default: 0},
  name: {type: String, required: true},
  finished: {type: Number, default: 0},
  image: {type: Boolean, default: false},
  surname: {type: String, required: true},
  password: {type: String, required: true},
  accountType: {type: String, required: true},
  online: {type: Date, default: new Date(0)},
  phone: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  categories: [{type: Types.ObjectId, ref: `Category`, required: true}],
  username: {type: String, required: true, unique: true, lowercase: true},
  location: {
    city: {
      type: String,
      default: ``,
    },
    region: {
      type: String,
      default: ``,
    },
    country: {
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
  social: {
    twitter: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    facebook: {
      type: String,
      default: '',
    },
  },
});

schema.pre<UserType>(`save`, async function() {
  if (this.isModified(`password`)) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

// Static methods
schema.statics.getAllData = async function(
  this: Model<UserType>,
  username: string,
): Promise<UserType | null> {
  return await this
    .findOne({username})
    .populate(`categories`)
    .select(`_id quote cv
      name surname username online
      social image rating accountType
      finished location categories
    `)
    .exec();
};

export default model<UserType, UserModel>(`User`, schema);
