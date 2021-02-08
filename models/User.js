const {Schema, model} = require(`mongoose`);

const scheme = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  phone: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  accountType: {type: String, required: true},
});

module.exports = model(`User`, scheme);
