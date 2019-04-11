var mongoose = require('mongoose')

const taskGroupSchema = new mongoose.Schema({
  title: String,
  status: Boolean,
  dateAdded: { type: Date, default: Date.now() },
  dateCompleted: Date,
  room: String
})

module.exports = mongoose.model('TaskGroup', taskGroupSchema);
