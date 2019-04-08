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
    res.render('createSpace', {user: req.session.user, userId: req.session.userId});
  }
});

router.post('/createSpace', function (req, res) {

  Space.find({space_name: req.body.space}, function (err, results) {
    //console.log(results)

    if (!results.length) {

      var create = new Space({
        space_name: req.body.space,
        password: req.body.password,
        mates: [req.session.userId]
      })

      //console.log("check")

      create.save(function (err, space) {
        if (err){
          next(err);
        }
        req.session.space = space.id;
        var us = User.findById(req.session.userId, function (err, u) {
            //console.log(req.session.user)
          if (!err) {
            //console.log("check123")
            u.space = space.id;
            u.save(function (err) {
            });
          }
        });
       res.redirect('/');
      })
    } else {
      res.render('createSpace', {user: req.session.user, userId: req.session.userId, error: "Space ALready present"});
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
    res.render('join_space', {user: req.session.user, userId: req.session.userId});
  }
});

router.post('/join_space', function (req, res) {

    Space.findOne({space_name: req.body.space_name, password: req.body.password}, function(err, space) {
      if (space) {
        req.session.space = space.id;
        space.mates.push(req.session.userId);
        space.save(function(err){
        });
        var us = User.findById(req.session.userId, function (err, u) {
          if (!err) {
            u.space = space.id;
            u.save(function (err) {
            });
          }
        });
        res.redirect('/');
      }
      else {
        res.render('join_space', {user: req.session.user, userId: req.session.userId, error: "Error"});
      }
    })
})

//Add Leave Space Later

module.exports = router
