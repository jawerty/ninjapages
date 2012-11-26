
/**
 * Module dependencies.
 */
var crypto = require('crypto');
require( './db' );

var express = require('express')
  , home = require('./routes/home')
  , signup = require('./routes/signup')
  , user_view = require('./routes/user_view')
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
//app.get('/:userid', user_view.index)
app.get('/', home.home);
app.post('/', home.home_post_handler);
app.post('/user/:id', user_view.index);
app.get('/signup', signup.signup);
app.post('/signup', signup.signup_post_handler);
app.get('/signup-failure', signup.failure);
app.get('/signup-success', signup.success);


app.get('/contact', home.page_contact);
app.get('/logout', function(req, res) {
    
    delete req.session.username;
    username = undefined; 
    console.log(username);
    res.redirect('/');
});
app.use(function(req,res) { 
    res.render('404', 
               { locals: {'title':'gamefox url is Not Found'}, }, 
               function(err,str) { res.send(str,404); 
               }
); 
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("pagefly server listening on port " + app.get('port'));
});
