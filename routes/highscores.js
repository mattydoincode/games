var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var parseHelper = require('../parseHelper');

var privateKey = process.env.HIGH_SCORE || require('../keys').HIGH_SCORE;

var gameSettings = {
	snake: {
		maxScore: 3750,
		maxScorePerSecond: 30
	},
	falldown: {
		maxScore: 3750,
		maxScorePerSecond: 30
	},
	cuberunner: {
		maxScore: 3750,
		maxScorePerSecond: 30
	}
};

function bail(req, res, message) {
	// nuke session
	for (prop in req.session) { 
		if (req.session.hasOwnProperty(prop) && prop != 'cookie') { 
			delete req.session[prop]; 
		} 
	}

	// respond with 400
	res.send(400, message);
};

exports.getSavingKey = function(req, res) {

	// inputs
	var clientKey = req.param('c');
	var currentG = req.param('q');
	var requestedWith = req.get('X-Requested-With');

	// validation
	if (!clientKey || clientKey == '') {
		return bail(req, res, "you're miles away, keep trying.");
	}
	if (!gameSettings[currentG] || !req.session.game[currentG]) {
		return bail(req, res, "i'm singinggggg in the rain.");
	}
	if (requestedWith != 'XMLHttpRequest') {
		return bail(req, res, "there once was a man named bob.");
	}

	// record game start
	parseHelper.recordPlay(currentG);

	// security
	var timestamp = new Date().getTime();
	var random = Math.floor((Math.random()*1000)+1);;
	var extraHash = crypto.createHash('md5').update(privateKey + random + '').digest("hex");
	var tmpKey = bcrypt.hashSync(timestamp + random + extraHash, bcrypt.genSaltSync());

	// save this in the session for later
	req.session[tmpKey] = {
		timestamp: timestamp,
		clientKey: clientKey,
		game: currentG
	};

	res.send(tmpKey);
};

exports.updateSavingKey = function(req, res) {

	// inputs
	var tmpKey = req.param('k');
	var requestedWith = req.get('X-Requested-With');
	var username = req.get('X-Here-We-Go');
	var scorePlusSevenOrNine = parseInt(req.get('X-Lets-Do-It'));

	// validation
	if (!req.session[tmpKey]) {
		return bail(req, res, "you're miles away, keep trying.");
	}
	if (requestedWith != 'XMLHttpRequest') {
		return bail(req, res, "there once was a man named bob.");
	}

	// validate game score
	var gameStart = req.session[tmpKey].timestamp;
	var gameEnd = new Date().getTime();
	var settings = gameSettings[req.session[tmpKey].game];
	var maxFeasibleScore = settings.maxScorePerSecond*((gameEnd - gameStart)/1000);
	var realScore = req.session[tmpKey].clientKey%2 == 0 ? scorePlusSevenOrNine - 7 : scorePlusSevenOrNine - 9;
	if (realScore > maxFeasibleScore || realScore > settings.maxScore || realScore%10 != 0) {
		return bail(req, res, "well aren't you speedy");
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
		score: realScore
	};

	// clear out tmpKey
	delete req.session[tmpKey];

	res.send(hash);
};

exports.saveHighScore = function(req, res) {
	
	// inputs
	var clientKey = req.body.c;
	var clientTime = req.body.t;
	var clientRand = req.body.r;
	var clientSalt = req.body.y;
	var currentG = req.body.g;
	var serverKey = req.body.b;
	var hash = req.body.h;
	var tryHarder = req.get('X-Try-Harder');
	var requestedWith = req.get('X-Requested-With');
	var savingKey = req.session[clientKey];

	// validation
	if (savingKey == null) {
		return bail(req, res, 'http://tinyurl.com/congratsDoodYouDidIt');
	}
	if (requestedWith != 'XMLHttpRequest') {
		return bail(req, res, "bob enjoyed long walks on the beach.");
	}
	if (savingKey.timestamp + 10000 < new Date().getTime()) {
		return bail(req, res, "you failed! bahaha");
	}
	if (savingKey.hash != serverKey) {
		return bail(req, res, 'are you trying to get your IP blocked?');
	}
	if (!req.session.game || !req.session.game[currentG]) {
		return bail(req, res, "but bob was often lonely :(");
	}
	if (tryHarder != crypto.createHash('sha1').update(savingKey.username + serverKey).digest("hex")) {
		return bail(req, res, "keep going, you're almost there... NAHT!");
	}

	// security
	var extraHash = crypto.createHash('md5').update(clientKey + serverKey).digest("hex");
	var correctHash = crypto.createHash('sha1').update(clientTime + savingKey.score + savingKey.username + clientRand + currentG + extraHash + clientSalt).digest("hex");
	if (correctHash != hash) {
		return bail(req, res, 'are you trying to get MAC address blocked!?!?');
	}

	// ok now it's valid, let's save it
	parseHelper.recordHighScore(savingKey.score, savingKey.username, currentG, res);

	// clear out clientKey
	delete req.session[clientKey];
};
