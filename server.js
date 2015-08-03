var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var session = require('express-session');
var passport = require('./middleware/passport-middleware');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UserSchema = require('./models/users-schema.js');

// <--Middleware-->
app.use(express.static('public'));
app.use(session({
	secret: 'plsfindmyfood',
	resave: false,
	saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
//<--Middleware End-->
mongoose.connect('mongodb://localhost/find-me-food');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log('success!');
});

var User = mongoose.model('Users', UserSchema);

app.route('/login')
	.post(function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			console.log('user', user);
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.send(false);
			}
			req.logIn(user, function(err) {
				if (err) {
					return next(err);
				}
				res.status(200).send(true);

			});
		})(req, res, next);
	});

app.route('/register')
	.post(function(req, res) {
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;

		User.findOne({
			username: username
		}).then(function(response) {
			if (response) {
				console.log('not created')

				res.status(200).send(false)
			} else {
				console.log('created')
				createUser(username, email, password);
				res.status(200).send(true);
			}

		});

	});

function createUser(username, email, password) {

	var salt = bcrypt.genSaltSync(15);
	var hash = bcrypt.hashSync(password, salt);
	User.create({
		username: username,
		email: email,
		password: hash
	});
}

app.listen(3000);