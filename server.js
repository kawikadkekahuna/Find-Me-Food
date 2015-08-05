var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UserSchema = require('./models/users-schema.js');
var path = require('path');

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

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({
			username: username
		}, function(err, user) {
			console.log('user',user);
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false);
			}
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

//<--Middleware End-->
mongoose.connect('mongodb://localhost/find-me-food');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
	console.log('success!');
});

var User = mongoose.model('Users', UserSchema);


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

	})
	.get(function(req, res) {
		res.redirect('/');
	});



app.route('/map')
	.get(function(req, res) {
		res.redirect('/#/map');
	});

app.route('/api/users/verify')
	.get(function(req, res) {
		var user = {
			authenticated: req.isAuthenticated(),
			user: req.user
		}
		res.json(user);
	})


app.route('/login')
	.post(function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			console.log('user', user);
			console.log('In---------------------------');
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
				console.log('req.isAuthenticated()',req.isAuthenticated());
				res.status(200).send(true);

			});
		})(req, res, next);
	});



app.use(function(req, res) {
	res.redirect('/#/404');
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