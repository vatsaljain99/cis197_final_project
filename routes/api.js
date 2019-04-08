var express = require('express')
var router = express.Router();
var Question = require('../models/question.js')

router.get('/getQuestions', function (req, res, next) {
  questions = Question.find({}, function (err, result) {
    if (err) next(err)
    res.json(result);
  })
})

router.post('/addQuestion', function (req, res, next) {
  var { questionText } = req.body                 // ES6 shorthand
  var author = req.session.user
  var  q = new Question({ questionText, author }) // ES6 shorthand
  q.save(function (err, result) {
    if (err) next(err)
    res.json({ status: 'OK' })
  })
})

router.post('/answerQuestion', function (req, res, next) {
  var id = req.body.qid;
  var ans = req.body.answer;

  Question.findById(id, function (err, question) {
  question.answer = ans;
  question.save(function (saveErr, result) {
    if (saveErr) next(err)
    res.json({ success: 'OK' })
  })
})
})

module.exports = router;
