exports.index = function(req, res) {
	req.session.game = req.session.game || {};
	req.session.game.snake = true;
	require('../parseHelper').recordView('snake');
	res.render('snake', { 
		title: 'Snake',
		rank: '{{rank}}',
		username: '{{username}}',
		score: '{{score}}'
	});
};