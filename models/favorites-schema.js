var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Favorite = new mongoose.Schema({
	user_id: {type: Schema.Types.ObjectId, ref: 'users'},
	google_location: {type:Schema.Types.Mixed}
});

var Favorites = mongoose.model('Favorites', Favorite);
module.exports = Favorites;