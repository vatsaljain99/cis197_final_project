var mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  sender: String,
  room: String,
  text: String
})

module.exports = mongoose.model('Chat', chatSchema);
