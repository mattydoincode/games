// **************************
// ******** PROCESS *********
// **************************

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// **************************
// ****** DEPENDENCIES ******
// **************************

require('parse').Parse.initialize("SEHipMlc4GV6rEPmxZK5OMwk9zkJGRBp6XWIapGD", 'NhHEM0pmBzx3e5gYUgimgSfj49SLX3iB48TthPm1');
var express = require('express');
var pac = require('./routes/pacxon');
var snake = require('./routes/snake');
var cube = require('./routes/cube');
var falldown = require('./routes/falldown');
var highscores = require('./routes/highscores');
var app = express();

// **************************
// ******* MIDDLEWARE *******
// **************************

app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon(__dirname + "/public/images/favicon.ico")); 
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here12345431'));
app.use(express.session({secret: 'your secret here12345431'}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
//app.use(require('express-uglify').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// **************************
// ******** ROUTING *********
// **************************

// no home page yet, redirect to snake
app.get('/', function (req, res) {
	res.redirect("/snake");
});

app.get('/pacxon', pac.pacxon);
app.get('/snake', snake.index);
app.get('/falldown', falldown.index);
app.get('/cuberunner', cube.index);
app.get('/highscores', highscores.getSavingKey);
app.put('/highscores', highscores.updateSavingKey);
app.post('/highscores', highscores.saveHighScore);

// **************************
// ****** START SERVER ******
// **************************

app.listen(process.env.PORT, function() {
  console.log('Express server listening on port ' + process.env.PORT);
});
