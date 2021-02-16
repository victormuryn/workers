const {Schema, model, Types} = require(`mongoose`);

const schema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, default: 0},
  expire: {type: Date, required: true},
  date: {type: Date, required: true},
  author: {type: Types.ObjectId, ref: `User`, required: true},
  views: {type: Number, default: 0},
  // categories: {type: Types.ObjectId, required: true},
  // tags: {type: Types.ObjectId}
});

module.exports = model(`Project`, schema);
