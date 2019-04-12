var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var isAuthenticated = require('./middlewares/isAuthenticated.js');
var Question = require('./models/question.js');
var Space = require('./models/space.js')
var accountRouter = require('./routes/account.js');
var spaceRouter = require('./routes/space.js');
var async = require('async')

var {apiRoutes, remaining_assignments_single, done_assignments_single, getRoommates, remaining_assignments_group, all_assignments, done_assignments_group} = require('./routes/api.js')
var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new')

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// TODO: configure body parser middleware to also accept json. just do
// app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


// app.get('/', function (req, res, next) {
//   questions = Question.find({}, function (err, result) {
//     if (err) next(err)
//     res.render('index', {
//       questions: result,
//       user: req.session.user
//     })
//   })
// });
//
//
// app.post('/', function (req, res, next) {
//   var questionText = req.body.question;
//   var q = new Question({ questionText: questionText, author: req.session.user})
//   q.save(function (err, result) {
//     if (!err) {
//       res.redirect('/')
//     } else {
//       next(err)
//     }
//   })
// })
//
//
// app.use('/account', accountRouter)
// app.use('/api', apiRouter)
// app.use('/space', spaceRouter)


app.get('/', function (req, res) {
  if (req.session.space) {
    var space = req.session.space;
    Space.findById(space, function(err, data) {
      //console.log(space)
      done_assignments_single(space, function(err, doneTasks) {
        remaining_assignments_single(space, function(err, tasks) {
          getRoommates(space, function(err, mates) {
            done_assignments_group(space, function(err, doneGTasks) {
              remaining_assignments_group(space, function(err, gTasks) {
                async.forEachOf(gTasks, (value, key, callback) => {
                  all_assignments(value.id, function(err, subTasks) {
                    if (!err) {
                      gTasks[key].subTasks = subTasks;
                    } else {
                      gTasks[key].subTasks = [];
                    }
                    callback();
                  })
                }, err => {
                    if (!err) res.render('index', {user: req.session.user, userId: req.session.userId, space: data, tasks, mates, gTasks, doneTasks, doneGTasks });
                    else res.render('index', {user: req.session.user, userId: req.session.userId, space: data, tasks, mates, gTasks, doneTasks, doneGTasks });
                });
              });
            })
          });
        });
      });
    });

  } else if (req.session.user) {
    res.redirect('/space/join_space');
  } else {
    res.redirect('/account/login');
  }
});

app.post('/', function (req, res) {
});


app.use('/account', accountRouter)
app.use('/api', apiRoutes)
app.use('/space', spaceRouter)

// TODO: Mount api routes at '/api' prefix

// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
