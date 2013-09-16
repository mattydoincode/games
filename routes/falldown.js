exports.index = function(req, res) {
  req.session.game = 'falldown';
  res.render('falldown', { 
  	title: 'Falldown',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}',
  	isDev: process.env.NODE_ENV == 'development' ? 'true' : 'false'
  });
};