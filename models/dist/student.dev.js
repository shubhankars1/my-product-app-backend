"use strict";

var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  address: String
}, {
  versionKey: false
}); //we will create a new collection

var Student = new mongoose.model('Student', studentSchema, 'studentCollection'); // const variable , user defined schema , collection name

module.exports = Student;