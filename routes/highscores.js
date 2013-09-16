var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var Parse = require('parse').Parse;
var keys = require('../keys').KEYS;

Parse.initialize("SEHipMlc4GV6rEPmxZK5OMwk9zkJGRBp6XWIapGD", keys.PARSE);

var validKeys = {};

var maxGameScores = {
	snake: 3750,
	falldown: 1000,
	cuberunner: 1000
};

exports.getSavingKey = function(req, res) {

	var clientKey = req.param('c');

	if (!clientKey || clientKey == '') {
		res.send(400, "you're miles away, keep trying.");
		return;
	}

	var privateKey = keys.HIGH_SCORE;
	var timestamp = new Date().getTime();
	var random = Math.floor((Math.random()*1000)+1);;
	var salt = bcrypt.genSaltSync();
	var extraHash = crypto.createHash('md5').update(privateKey + random + '').digest("hex");
	var hash = bcrypt.hashSync(timestamp + privateKey + random + extraHash, salt);

	validKeys[clientKey] = {
		timestamp: timestamp,
		hash: hash
	};

	res.send(hash);
};

exports.saveHighScore = function(req, res) {
	
	var clientKey = req.body.c;

	if (validKeys[clientKey] == null) {
		res.redirect('http://tinyurl.com/congratsDoodYouDidIt');
		return;
	}

	var serverTime = new Date().getTime();

	if (validKeys[clientKey].timestamp + 10000 < serverTime) {
		res.send(400, "you failed! bahaha");
		return;
	}

	var score = parseInt(req.body.s);
	var clientTime = req.body.t;
	var clientRand = req.body.r;
	var clientSalt = req.body.y;
	var game = req.body.g;
	var username = req.body.u;
	var serverKey = req.body.bahaha;

	if (validKeys[clientKey].hash != serverKey) {
		res.send(400, 'are you trying to get your IP blocked?');
		return;
	}

	if (maxGameScores[game] == null) {
		res.send(400, "it's just funny at this point...");
		return;
	}

	var hash = req.body.h;
	var extraHash = crypto.createHash('md5').update(clientKey + serverKey).digest("hex");
	var correctHash = crypto.createHash('sha1').update(clientTime + score + username + clientRand + game + extraHash + clientSalt).digest("hex");

	if (correctHash != hash) {
		res.send(400, 'are you trying to get MAC address blocked!?!?');
		return;
	}

	if (score > maxGameScores[game]) {
		res.send(400, 'and you made it so far... how sad');
		return;
	}

	// ok now it's valid, let's save it

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
