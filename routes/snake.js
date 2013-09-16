exports.index = function(req, res){
  res.render('snake', { 
  	title: 'Snake',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}',
  	isDev: process.env.NODE_ENV == 'development' ? 'true' : 'false'
  });
};