var mongoose = require('mongoose')

const group_assignmentsSchema = new mongoose.Schema({
  heading: String,
  condition_of_assignment: Boolean,
  space: String
})

module.exports = mongoose.model('Group_assignments', group_assignmentsSchema);

// var mongoose = require('mongoose')
//
// const taskGroupSchema = new mongoose.Schema({
//   title: String,
//   status: Boolean,
//   dateAdded: { type: Date, default: Date.now() },
//   dateCompleted: Date,
//   room: String
// })
//
// module.exports = mongoose.model('TaskGroup', taskGroupSchema);
