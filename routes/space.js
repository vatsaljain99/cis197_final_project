var express = require('express')
var router = express.Router();
var mongoose = require('mongoose')
var Space = require('../models/space.js')
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user')

router.get('/createSpace', function (req, res) {
  if (!req.session.user) {
    res.redirect('/');
  } else if (req.session.space) {
    res.redirect('/');
  } else {
    res.render('createSpace', {
      user: req.session.user,
      userId: req.session.userId,
      error: ""
    });
  }
});

router.get('/available_spaces', function (req, res) {
  Space.find({}, function (err, results) {
    res.render('available_spaces' , {space: results})
  })
    
});

router.post('/createSpace', function (req, res) {

  Space.find({
    space_name: req.body.space,
    password: req.body.password
  }, function (err, results) {
    //console.log(results)

    if (!results.length) {

      var create = new Space({
        space_name: req.body.space,
        password: req.body.password,
        mates: [req.session.userId]
      })

      //console.log("check")

      create.save(function (err, space) {
        if (err) {
          next(err);
        }
        req.session.space = space.id;
        //console.log(req.session.space)
        var us = User.findById(req.session.userId, function (err, u) {
          //console.log(req.session.user)
          if (!err) {
            //console.log("check123")
            u.space = space.id;
            u.save(function (err) {});
          }
        });
        res.redirect('/');
      })
    } else {
      res.render('createSpace', {
        user: req.session.user,
        userId: req.session.userId,
        error: "Space Already present"
      });
      //console.log("NO")
    }
  })
})

router.get('/join_space', function (req, res) {

  if (!req.session.user) {
    res.redirect('/');
  } else if (req.session.space) {
    res.redirect('/');
  } else {
    res.render('join_space', {
      user: req.session.user,
      userId: req.session.userId,
      error: ""
    });
  }
});

router.post('/join_space', function (req, res) {
  var space_name = req.body.space_name;
  var password = req.body.password;

  Space.findOne({
    space_name: space_name,
    password: password
  }, function (err, space) {
    if (space) {
      req.session.space = space.id;
      //console.log(req.session.space)
      space.mates.push(req.session.userId);
      //console.log(req.session.userId);
      //console.log(space.mates);
      space.save(function (err) {});
      var us = User.findById(req.session.userId, function (err, u) {
        if (!err) {
          u.space = space.id;
          u.save(function (err) {});
        }
      });
      res.redirect('/');
    } else {
      res.render('join_space', {
        user: req.session.user,
        userId: req.session.userId,
        error: "Space not present"
      });
    }
  })
})

router.get('/leave_space', function (req, res, next) {
  var roomTitle = req.session.user;
  var db = User.findById(req.session.userId, function (err, result) {
      if (err) {
        next(err);
      } else {
        result.space = null;
        result.save(function (err, result) {
            if (err) next(err);
            var rdb = Space.findById(req.session.space, function (err, space) {
                if (err) {
                  next(err);
                } else {
                  var i = space.mates.indexOf(req.session.userId);
                  if (i > -1) {
                    space.mates.splice(i, 1);
                  }
                  req.session.space = null;
                  space.save(function (err, mSpace) {
                    if (err) next(err);
                    res.redirect('/');
                  });
                }

            });
        });
    }
  })
})

module.exports = router
