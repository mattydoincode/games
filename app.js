process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

var express = require('express');
var pac = require('./routes/pacxon');
var snake = require('./routes/snake');
var cube = require('./routes/cube');
var falldown = require('./routes/falldown');
var highscores = require('./routes/highscores');
var expressUglify = require('express-uglify');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon(__dirname + "/public/images/favicon.ico")); 
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
//app.use(minify());
app.use(expressUglify.middleware({ 
  src: __dirname + '/public'
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
	res.redirect("/snake");
});
app.get('/pacxon', pac.pacxon);
app.get('/snake', snake.index);
app.get('/falldown', falldown.index);
app.get('/cuberunner', cube.index);
app.get('/highscores', highscores.getSavingKey);
app.post('/highscores', highscores.saveHighScore);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
