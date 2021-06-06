import {Document, Schema, model, Types} from 'mongoose';

import {CategoryType} from './Category';
import * as bcrypt from 'bcrypt';
import {CityDocument} from "./City";

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
  location: CityDocument['_id'],
  social: {
    twitter: string,
    github: string,
    website: string,
    instagram: string,
    facebook: string,
  }
}

const schema = new Schema<UserType>({
  cv: {type: String, default: ``},
  quote: {type: String, default: ``},
  rating: {type: Number, default: 0},
  name: {type: String, required: true},
  finished: {type: Number, default: 0},
  image: {type: Boolean, default: false},
  surname: {type: String, required: true},
  password: {type: String, required: true},
  accountType: {type: String, required: true},
  location: {type: Types.ObjectId, ref: `City`},
  online: {type: Date, default: new Date(0)},
  phone: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true, lowercase: true},
  categories: [{type: Types.ObjectId, ref: `Category`, required: true}],
  username: {type: String, required: true, unique: true, lowercase: true},
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

export default model<UserType>(`User`, schema);
