var Parse = require('parse').Parse;

var tracking = {};

var Tracking = Parse.Object.extend("Tracking");
var query = new Parse.Query(Tracking);
query.find({
	success: function(results) {
		for (var i = 0; i < results.length; i++) {
			tracking[results[i].attributes.game] = results[i];
		}
	},
	error: function(error) {
		console.log("Tracking failed");
		console.log(error);
	}
});

exports.recordView = function(name) {
	if (!tracking[name] || process.env.NODE_ENV == 'development') {
		return;
	}

	tracking[name].increment("views");
	tracking[name].save();
};

exports.recordPlay = function(name) {
	if (!tracking[name] || process.env.NODE_ENV == 'development') {
		return;
	}

	tracking[name].increment("plays");
	tracking[name].save();
};

exports.recordHighScore = function(score, username, game, res) {
	var HighScore = Parse.Object.extend("HighScore");
	var newScore = new HighScore();

	newScore.set("score", score);
	newScore.set("username", username);
	newScore.set("game", game);

	newScore.save(null, {
		success: function (gameScore) {
			res.send('saved score.');
		},
		error: function(gameScore, error) {
			console.log(error);
		  	console.log('Failed to create new object, with error code: ' + error.description);
			res.send(500, 'failed to save score.');
		}
	});
};

