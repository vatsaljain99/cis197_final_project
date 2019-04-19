var mongoose = require('mongoose')

const group_assignmentsSchema = new mongoose.Schema({
  heading: String,
  condition_of_assignment: Boolean,
  space: String
})

module.exports = mongoose.model('Group_assignments', group_assignmentsSchema);
