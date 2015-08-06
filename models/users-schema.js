var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	username:String,
	password:String,
	email:String,
	date: {type: Date, default: Date.now},

});

var Users = mongoose.model('User', User);

module.exports = Users;