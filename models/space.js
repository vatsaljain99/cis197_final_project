var mongoose = require('mongoose')
const spaceSchema = new mongoose.Schema({
  space_name: String,
  password: String,
  mates: {type: [String], default: []}
})
module.exports = mongoose.model('Space', spaceSchema);
