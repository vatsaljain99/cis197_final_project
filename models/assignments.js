var mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  heading: String,
  condition_of_assignment: Boolean,
  id_of_responsible: String,
  name_of_responsible: { type: String, default: '' },
  space: String
})

module.exports = mongoose.model('Assignments', assignmentSchema);
