var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Passport = function() {

	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({
				username: username
			}, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Incorrect username.'
					});
				}
				if (!user.validPassword(password)) {
					return done(null, false, {
						message: 'Incorrect password.'
					});
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

	return passport;
}


module.exports = new Passport();