var mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  heading: String,
  space: String,
  name_of_responsible: { type: String, default: '' },
  condition_of_assignment: Boolean,
  date_of_starting_assignemnt: { type: Date, default: Date.now() },
  date_of_competion_of_assignment: Date,
})

module.exports = mongoose.model('Assignments', taskSchema);
