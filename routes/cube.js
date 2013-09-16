exports.index = function(req, res){
  req.session.game = 'cuberunner';
  res.render('cube', { 
  	title: 'Cube Runner',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}'
  });
};