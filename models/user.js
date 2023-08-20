
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    pass : String,
}, {versionKey:false});

const User = new mongoose.model('User', userSchema, 'userList');

module.exports = User;