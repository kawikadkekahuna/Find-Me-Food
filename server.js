var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('./middleware/passport-middleware');
var bodyParser = require('body-parser');

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
app.listen(3000);