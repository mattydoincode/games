exports.index = function(req, res){
	var currentSesh = req.session;
	if(!currentSesh.game){
		currentSesh.game = {snake:true};
	}
	else{
		currentSesh.game.snake=true;
	}
	res.render('snake', { 
		title: 'Snake',
		rank: '{{rank}}',
		username: '{{username}}',
		score: '{{score}}',
		isDev: process.env.NODE_ENV == 'development' ? 'true' : 'false'
	});
};