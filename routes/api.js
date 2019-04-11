var express = require('express')
var apiRoutes = express.Router();
var User = require('../models/user.js')
var Task = require('../models/task.js')
var Room = require('../models/space.js')
var TaskGroup = require('../models/taskGroup.js')

var getRemainingGroupTasks = function(roomID, callback) {
  var taskDb = TaskGroup.find({room: roomID, status: false}, function (err, results) {
    if (!err) {
      callback(null, results);
    } else {
      callback(err, []);
    }
  })
}

var getDoneGroupTasks = function(roomID, callback) {
  var taskDb = TaskGroup.find({room: roomID, status: true}, function (err, results) {
    if (!err) {
      callback(null, results);
    } else {
      callback(err, []);
    }
  })
}

var getAllTasks = function(roomID, callback) {
  var taskDb = Task.find({room: roomID}, function (err, results) {
    if (!err) {
      callback(null, results);
    } else {
      callback(err, []);
    }
  })
}

var getRemainingTasks = function(roomID, callback) {
  var taskDb = Task.find({room: roomID, status: false}, function (err, results) {
    if (!err) {
      callback(null, results);
    } else {
      callback(err, []);
    }
  })
}

var getDoneTasks = function(roomID, callback) {
  var taskDb = Task.find({room: roomID, status: true}, function (err, results) {
    if (!err) {
      callback(null, results);
    } else {
      callback(err, []);
    }
  })
}

var getRoommates = function(roomID, callback) {
  var userDb = User.find({space: roomID}, function (err, results) {
    if (!err) {
      callback(null, results);
    } else {
      callback(err, []);
    }
  })
}

apiRoutes.get('/getRoommates', function (req, res, next) {
	var roomDb = Room.findById(req.session.space, function (err, result) {
    if (!err) {
      res.json(result.mates)
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/addTask', function (req, res, next) {
  var { taskTitle } = req.body; // ES6 shorthand
  var task = new Task({
    title: taskTitle,
    status: false,
    responsible: "",
    room: req.session.space
  })
  task.save(function (err, task) {
    if (err) next(err);
    res.redirect('/');
  })
})

apiRoutes.post('/addGroupTask', function (req, res, next) {
  var { taskTitle, tasks } = req.body;
  var task = new TaskGroup({
    title: taskTitle,
    status: false,
    room: req.session.space
  })
  task.save(function (err, task) {
    if (err) next(err);
    var subtasks = tasks.split(',');
    subtasks.forEach(function(item) {
      var subtask = new Task({
          title: item,
          status: false,
          responsible: "",
          room: task.id
      })
      subtask.save(function (err, task) {
        if (err) console.log(err);
      })
    })
    res.redirect('/');
  })
})

apiRoutes.post('/deleteTask', function (req, res, next) {
  var { taskId } = req.body;
  var taskDb = Task.findById(taskId, function (err, result) {
    if (!err) {
      result.remove()
      res.redirect('/');
    } else {
      next(err)
    }
  })
})

apiRoutes.post('/doTask', function (req, res, next) {
  var { taskId } = req.body;
  var taskDb = Task.findById(taskId, function (err, result) {
      if (!err) {
        result.responsible = req.session.userId;
        result.responsibleName = req.session.user;
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

apiRoutes.post('/leaveTask', function (req, res, next) {
  var { taskId } = req.body;
  var taskDb = Task.findById(taskId, function (err, result) {
    if (!err) {
      result.responsible = "";
      result.responsibleName = '';
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

apiRoutes.post('/completeTask', function (req, res, next) {
var { taskId } = req.body;
var taskDb = Task.findById(taskId, function (err, result) {
    if (!err) {
      result.status = true;
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

apiRoutes.post('/completeSubTask', function (req, res, next) {
  var { taskId } = req.body;
  var taskDb = Task.findById(taskId, function (err, result) {
  if (!err) {
    result.status = true;
    result.save(function (err, task) {
      console.log(err)
      if (err) next(err);
      getRemainingTasks(task.room, function(err, remaining) {
        if (!remaining.length) {
          var gTaskDb = TaskGroup.findById(task.room, function(err, parentTask) {
            parentTask.status = true;
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

apiRoutes.post('/deleteSubTask', function (req, res, next) {
  var { taskId } = req.body;
  var taskDb = Task.findById(taskId, function (err, task) {
    if (!err) {
      task.remove()
      getAllTasks(task.room, function(err, allTasks) {
        if (!allTasks.length) {
          var gTaskDb = TaskGroup.findById(task.room, function(err, parentTask){
            parentTask.remove();
            res.redirect('/');
            return
          })
        } else {
          getRemainingTasks(task.room, function(err, remaining) {
            if (err) next(err);
            if (!remaining.length) {
              var gTaskDb = TaskGroup.findById(task.room, function(err, parentTask) {
                parentTask.status = true;
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

module.exports = {
  apiRoutes,
  getRemainingTasks,
  getDoneTasks,
  getAllTasks,
  getRoommates,
  getRemainingGroupTasks,
  getDoneGroupTasks
};
