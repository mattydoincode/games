exports.index = function(req, res){
  res.render('index', { 
  	title: 'Snake',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}'
  });
};