
/**
 * Module dependencies.
 */
var crypto = require('crypto');
require( './db' );
var username = undefined;

var express = require('express')
  , home = require('./routes/home')
  , signup = require('./routes/signup')
  , http = require('http')
  , path = require('path');
var MongoStore = require('connect-mongo')(express);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', home.index);
app.get('/home', home.home);
app.post('/home', home.home_post_handler);


app.get('/home/signup', signup.signup);
app.post('/home/signup', signup.signup_post_handler);
app.get('/home/signup-failure', signup.failure);
app.get('/home/signup-success', signup.success);

///////change///////
app.get('/guilds', home.index);
app.get('/user/friend', home.index);
app.get('/ask', home.index);
////////soon////////

app.get('/home/contact', home.page_contact);
app.get('/logout', function(req, res) {
    // delete the session variable
    delete req.session.username;
    username = undefined; 
    // redirect user to homepage
    res.redirect('/home');
});
app.use(function(req,res) { 
    res.render('404', 
               { locals: {'title':'gamefox url is Not Found'}, }, 
               function(err,str) { res.send(str,404); 
               }
); 
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("gamefox server listening on port " + app.get('port'));
});
