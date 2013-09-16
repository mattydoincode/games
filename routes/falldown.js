exports.index = function(req, res) {
	req.session.game = req.session.game || {};
	req.session.game.falldown = true;
	require('../parseHelper').recordView('falldown');
	res.render('falldown', { 
		title: 'Falldown',
		rank: '{{rank}}',
		username: '{{username}}',
		score: '{{score}}'
	});
};