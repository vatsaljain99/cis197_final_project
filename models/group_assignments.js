var mongoose = require('mongoose')

const group_assignmentsSchema = new mongoose.Schema({
  heading: String,
  space: String,
  condition_of_assignment: Boolean,
  date_of_starting_assignemnt: { type: Date, default: Date.now() },
  date_of_competion_of_assignment: Date,
})

module.exports = mongoose.model('Group_assignments', taskSchema);
