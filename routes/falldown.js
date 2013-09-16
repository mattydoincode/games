exports.index = function(req, res){
  res.render('falldown', { 
  	title: 'Falldown',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}',
  	isDev: process.env.NODE_ENV == 'development' ? 'true' : 'false'
  });
};