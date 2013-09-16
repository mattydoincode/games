exports.index = function(req, res){
	req.session.game = req.session.game || {};
	req.session.game.cuberunner = true;
	res.render('cube', { 
		title: 'Cube Runner',
		rank: '{{rank}}',
		username: '{{username}}',
		score: '{{score}}'
	});
};