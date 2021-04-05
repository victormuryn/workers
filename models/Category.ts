import {Document, Schema, model} from 'mongoose';

export interface CategoryType extends Document {
  url: string,
  title: string,
}

const schema = new Schema<CategoryType>({
  url: {type: String, required: true, unique: true},
  title: {type: String, required: true, unique: true},
});

export default model<CategoryType>(`Category`, schema);
