import {Document, Schema, model} from 'mongoose';

export interface CityType {
  city: string,
  district: string,
  region: string,
  latitude: number,
  longitude: number,
}

export interface CityDocument extends CityType, Document {}

const schema = new Schema<CityDocument>({
  city: {type: String, required: true},
  district: {type: String, required: true},
  region: {type: String, required: true},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
});

export default model<CityDocument>(`City`, schema);
