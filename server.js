var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/users-schema.js');
var Favorites = require('./models/favorites-schema.js');
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


app.route('/api/users/register')
	.post(function(req, res) {
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;

		User.findOne({
			username: username
		}).then(function(response) {
			if (response) {
				res.status(200).send(false)
			} else {
				createUser(username,email,password);
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

app.route('/api/users/add-favorite')
	.get(function(req,res){

	})
	.post(function(req,res){
		console.log('req.body',req.body.location);
		res.send('got it ');
	})
app.route('/favorites')
	.get(function(req,res){
		res.redirect('/#/favorites')
	})


app.route('/api/users/login')
	.post(function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
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
				var user = {
					authenticated: req.isAuthenticated(),
					user: req.user
				}
				res.status(200).send(user);

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

function addFavorite(id,location) {

	var salt = bcrypt.genSaltSync(15);
	var hash = bcrypt.hashSync(password, salt);
	Favorites.create({
		user_id: id,
		google_location: location
	});
}



app.listen(3000);