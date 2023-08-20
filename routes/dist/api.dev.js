"use strict";

var express = require('express');

var router = express.Router();

var mongoose = require('mongoose');

var Student = require('../models/student'); // use mongoose


mongoose.connect("mongodb://localhost:27017/studentApi", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("mongoDb Connected");
})["catch"](function (err) {
  console.log(err);
}); // Create

router.post('/post', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var address = req.body.address;
  var studentModel = new Student();
  studentModel.name = name;
  studentModel.email = email;
  studentModel.phone = phone;
  studentModel.address = address;
  studentModel.save().then(function () {
    res.status(202).json({
      message: 'Student added Successfully'
    });
  })["catch"](function (err) {
    res.status(202).json({
      message: err
    });
  });
}); // R 
// U 
// D

module.exports = router;