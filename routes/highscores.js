var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var Parse = require('parse').Parse;

var privateKey = process.env.HIGH_SCORE || require('../keys').HIGH_SCORE;

Parse.initialize("SEHipMlc4GV6rEPmxZK5OMwk9zkJGRBp6XWIapGD", 'NhHEM0pmBzx3e5gYUgimgSfj49SLX3iB48TthPm1');

var maxGameScores = {
	snake: 3750,
	falldown: 1000,
	cuberunner: 1000
};

var maxGameScorePerSecond = {
	snake: 50,
	falldown: 50,
	cuberunner: 50
};

exports.getSavingKey = function(req, res) {

	// inputs
	var clientKey = req.param('c');
	var requestedWith = req.get('X-Requested-With');

	// validation
	if (!clientKey || clientKey == '') {
		res.send(400, "you're miles away, keep trying.");
		return;
	}
	if (requestedWith != 'XMLHttpRequest') {
		res.send(400, "there once was a man named bob.");
		return;
	}

	// security
	var timestamp = new Date().getTime();
	var random = Math.floor((Math.random()*1000)+1);;
	var extraHash = crypto.createHash('md5').update(privateKey + random + '').digest("hex");
	var tmpKey = bcrypt.hashSync(timestamp + random + extraHash, bcrypt.genSaltSync());

	// save this in the session for later
	req.session[tmpKey] = {
		timestamp: timestamp,
		clientKey: clientKey
	};

	res.send(tmpKey);
};

exports.updateSavingKey = function(req, res) {

	// inputs
	var tmpKey = req.param('k');
	var requestedWith = req.get('X-Requested-With');
	var username = req.get('X-Here-We-Go');
	var score = parseInt(req.get('X-Lets-Do-It'));
	var currentG = req.param('q');

	// validation
	if (!req.session[tmpKey] || req.session[tmpKey] == '') {
		res.send(400, "you're miles away, keep trying.");
		return;
	}
	if (requestedWith != 'XMLHttpRequest') {
		res.send(400, "there once was a man named bob.");
		return;
	}
	if (!req.session.game || !req.session.game[currentG]) {
		res.send(400, "let's go to the mall!");
		return;
	}

	// validate game length
	var gameStart = req.session[tmpKey].timestamp;
	var gameEnd = new Date().getTime();
	var maxFeasibleScore = maxGameScorePerSecond[currentG]*((gameEnd - gameStart)/1000);
	if (score > maxFeasibleScore || score > maxGameScores[currentG]) {
		res.send(400, "well aren't you speedy");
		return;	
	}

	// security
	var random = Math.floor((Math.random()*1000)+1);;
	var extraHash = crypto.createHash('md5').update(privateKey + random + '').digest("hex");
	var hash = bcrypt.hashSync(gameEnd + random + extraHash, bcrypt.genSaltSync());

	// save this in the session for later
	req.session[req.session[tmpKey].clientKey] = {
		timestamp: gameEnd,
		hash: hash,
		username: username,
		score: score
	};

	// clear out tmpKey
	req.session[tmpKey] = null;

	res.send(hash);
};

exports.saveHighScore = function(req, res) {
	
	// inputs
	// TODO use public/private key and don't send all this data...
	var clientKey = req.body.c;
	var clientTime = req.body.t;
	var clientRand = req.body.r;
	var clientSalt = req.body.y;
	var game = req.body.g;
	var serverKey = req.body.b;
	var hash = req.body.h;
	var tryHarder = req.get('X-Try-Harder');
	var requestedWith = req.get('X-Requested-With');
	var savingKey = req.session[clientKey];

	// validation
	if (savingKey == null) {
		res.redirect('http://tinyurl.com/congratsDoodYouDidIt');
		return;
	}
	if (requestedWith != 'XMLHttpRequest') {
		res.send(400, "bob enjoyed long walks on the beach.");
		return;
	}
	if (savingKey.timestamp + 10000 < new Date().getTime()) {
		res.send(400, "you failed! bahaha");
		return;
	}
	if (savingKey.hash != serverKey) {
		res.send(400, 'are you trying to get your IP blocked?');
		return;
	}
	if (!req.session.game || !req.session.game[game]) {
		res.send(400, "but bob was often lonely :(");
		return;
	}
	if (tryHarder != crypto.createHash('sha1').update(savingKey.username + serverKey).digest("hex")) {
		res.send(400, "keep going, you're almost there... NAHT!");
		return;
	}

	// security
	var extraHash = crypto.createHash('md5').update(clientKey + serverKey).digest("hex");
	var correctHash = crypto.createHash('sha1').update(clientTime + savingKey.score + savingKey.username + clientRand + game + extraHash + clientSalt).digest("hex");
	if (correctHash != hash) {
		res.send(400, 'are you trying to get MAC address blocked!?!?');
		return;
	}

	// ok now it's valid, let's save it
	var HighScore = Parse.Object.extend("HighScore");
	var newScore = new HighScore();

	newScore.set("score", savingKey.score);
	newScore.set("username", savingKey.username);
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

	// wipe away savingKey
	req.session[clientKey] = null;
};
