exports.index = function(req, res){
  res.render('cube', { 
  	title: 'Cube Runner',
  	rank: '{{rank}}',
  	username: '{{username}}',
  	score: '{{score}}'
  });
};