var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	username:String,
	password:String,
	email:String,
	date: {type: Date, default: Date.now},

});

module.exports = usersSchema;