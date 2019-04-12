var mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  heading: String,
  condition_of_assignment: Boolean,
  id_of_responsible: String,
  name_of_responsible: { type: String, default: '' },
  space: String
})

module.exports = mongoose.model('Assignments', assignmentSchema);

// var mongoose = require('mongoose')
//
// const taskSchema = new mongoose.Schema({
//   title: String,
//   status: Boolean,
//   responsible: String,
//   responsibleName: { type: String, default: '' },
//   dateAdded: { type: Date, default: Date.now() },
//   dateCompleted: Date,
//   room: String
// })
//
// module.exports = mongoose.model('Task', taskSchema);
