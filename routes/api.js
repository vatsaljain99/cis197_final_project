var express = require('express')
var apiRoutes = express.Router();
var User = require('../models/user.js')
var Assignments = require('../models/assignments.js')
var Space = require('../models/space.js')
var Group_assignments = require('../models/group_assignments.js')





apiRoutes.post('/add_assignemt', function (req, res, next) {
  var { taskTitle } = req.body;
  var task = new Assignments({
    heading: taskTitle,
    condition_of_assignment: false,
    id_of_responsible: "",
    space: req.session.space
  })
  task.save(function (err, task) {
    if (err) next(err);
    res.redirect('/');
  })
})

apiRoutes.post('/add_assignment_group', function (req, res, next) {
  var { taskTitle, tasks } = req.body;
  var task = new Group_assignments({
    heading: taskTitle,
    condition_of_assignment: false,
    space: req.session.space
  })
  task.save(function (err, task) {
    if (err) next(err);
    var subtasks = tasks.split(',');
    subtasks.forEach(function(item) {
      var subtask = new Assignments({
          heading: item,
          condition_of_assignment: false,
          id_of_responsible: "",
          space: task.id
      })
      subtask.save(function (err, task) {
        if (err) console.log(err);
      })
    })
    res.redirect('/');
  })
})

apiRoutes.post('/delete_duty', function (req, res, next) {
  var { taskId } = req.body;
  var db = Assignments.findById(taskId, function (err, result) {
    if (!err) {
      result.remove()
      res.redirect('/');
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/do_duty', function (req, res, next) {
  var { taskId } = req.body;
  var db = Assignments.findById(taskId, function (err, result) {
      if (!err) {
        result.id_of_responsible = req.session.userId;
        result.name_of_responsible = req.session.user;
        result.save(function (err, task) {
        console.log(err)
        if (err) next(err);
        res.redirect('/');
      })
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/remove_duty', function (req, res, next) {
  var { taskId } = req.body;
  var db = Assignments.findById(taskId, function (err, result) {
    if (!err) {
      result.id_of_responsible = "";
      result.name_of_responsible = '';
      result.save(function (err, task) {
        console.log(err)
        if (err) next(err);
        res.redirect('/');
      })
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/finish_duty', function (req, res, next) {
var { taskId } = req.body;
var db = Assignments.findById(taskId, function (err, result) {
    if (!err) {
      result.condition_of_assignment = true;
      result.save(function (err, task) {
        console.log(err)
        if (err) next(err);
        res.redirect('/');
      })
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/finish_sub_duty', function (req, res, next) {
  var { taskId } = req.body;
  var db = Assignments.findById(taskId, function (err, result) {
  if (!err) {
    result.condition_of_assignment = true;
    result.save(function (err, task) {
      console.log(err)
      if (err) next(err);
      remaining_assignments_single(task.space, function(err, remaining) {
        if (!remaining.length) {
          var gTaskDb = Group_assignments.findById(task.space, function(err, parentTask) {
            parentTask.condition_of_assignment = true;
            parentTask.save(function(err){
              if (err) next(err);
                res.redirect('/');
              });
            })
        } else {
            res.redirect('/');
          }
        });
      })
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/remove_sub_duty', function (req, res, next) {
  var { taskId } = req.body;
  var db = Assignments.findById(taskId, function (err, task) {
    if (!err) {
      task.remove()
      all_assignments(task.space, function(err, allTasks) {
        if (!allTasks.length) {
          var gTaskDb = Group_assignments.findById(task.space, function(err, parentTask){
            parentTask.remove();
            res.redirect('/');
            return
          })
        } else {
          remaining_assignments_single(task.space, function(err, remaining) {
            if (err) next(err);
            if (!remaining.length) {
              var gTaskDb = Group_assignments.findById(task.space, function(err, parentTask) {
                parentTask.condition_of_assignment = true;
                parentTask.save(function(err){
                  if (err) next(err);
                  res.redirect('/');
                  return
                });
              })
            } else {
              res.redirect('/');
              return
            }
          })
        }
      })
    } else {
      next(err)
    }
  })
})



var all_assignments = function(space_code, callback) {
  var db = Assignments.find({space: space_code}, function (err, results) {
    if(err) {
      callback(err, []);
    } else{
      callback(null, results);
    }
  })
}

var remaining_assignments_single = function(space_code, callback) {
  var db = Assignments.find({space: space_code, condition_of_assignment: false}, function (err, results) {
    if(err) {
      callback(err, []);
    } else{
      callback(null, results);
    }
  })
}

var done_assignments_single = function(space_code, callback) {
  var db = Assignments.find({space: space_code, condition_of_assignment: true}, function (err, results) {
    if(err) {
      callback(err, []);
    } else{
      callback(null, results);
    }
  })
}

var remaining_assignments_group = function(space_code, callback) {
  var db = Group_assignments.find({space: space_code, condition_of_assignment: false}, function (err, results) {
    if(err) {
      callback(err, []);
    } else{
      callback(null, results);
    }
  })
}

var done_assignments_group = function(space_code, callback) {
  var db = Group_assignments.find({space: space_code, condition_of_assignment: true}, function (err, results) {
    if(err) {
      callback(err, []);
    } else{
      callback(null, results);
    }
  })
}

var getRoommates = function(space_code, callback) {
  var userDb = User.find({space: space_code}, function (err, results) {
    if(err) {
      callback(err, []);
    } else{
      callback(null, results);
    }
  })
}


module.exports = {
  apiRoutes,
  remaining_assignments_single,
  done_assignments_single,
  all_assignments,
  getRoommates,
  remaining_assignments_group,
  done_assignments_group
};
