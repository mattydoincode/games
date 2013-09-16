exports.index = function(req, res){
  req.session.game = 'snake';
  res.render('snake', { 
  	title: 'Snake',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}',
  	isDev: process.env.NODE_ENV == 'development' ? 'true' : 'false'
  });
};