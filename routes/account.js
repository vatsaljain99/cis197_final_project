var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/user.js')

router.get('/signup', function (req, res) {
  User.find({}, function (err, results) {
  })
	res.render('signup', {error: ""});
})

router.post('/signup', function (req, res) {
  var un = req.body.username;
  User.find({username: un}, function (err, outputs) {
    console.log(outputs)
    if (outputs.length) {
			res.render('signup', {error: "There is a User with same Credentials"});
    } else {
			var u = new User({ username : req.body.username,
				password : req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				space: []});
			u.save(function (err, output) {
				if (err) {
          res.send('something went wrong: ' + err.message);

			} else {
				req.session.user = output.username
				req.session.space = null;
        req.session.userId = output.id;
				res.redirect('/account/login');
				}
			})
    }
  })
})

router.get('/login', function (req, res) {
  res.render('login', {error: ''});
})


router.post('/login', function (req, res) {

  User.findOne({ username: req.body.username, password: req.body.password }, function(err, output) {
  	if (!err && output !== null) {
  		req.session.user = output.username
      req.session.space = output.space;
      req.session.userId = output.id;
  		res.redirect('/');
  	}
  	else {
  		res.render('login', {error: 'Wrong Input'});
  	}
  })
})

router.get('/logout', isAuthenticated, function (req, res) {
  req.session.user = '';
  req.session.space = '';
  req.session.userId = '';
  res.redirect('/')
})
module.exports = router;
