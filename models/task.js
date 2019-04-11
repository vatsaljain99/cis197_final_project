var mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: String,
  status: Boolean,
  responsible: String,
  responsibleName: { type: String, default: '' },
  dateAdded: { type: Date, default: Date.now() },
  dateCompleted: Date,
  room: String
})

module.exports = mongoose.model('Task', taskSchema);
