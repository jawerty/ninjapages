/**
 * Module dependencies.
 */

var crypto = require('crypto');
require( './db' );

var express = require('express')
  , home = require('./routes/home')
  , signup = require('./routes/signup')
  , pages = require('./routes/pages')
  , user_view = require('./routes/user_view')
  , http = require('http')
  , path = require('path');

var app = express();
var store = new express.session.MemoryStore;

app.configure(function(){
  app.use(express.logger('dev'));
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({ secret: 'cb4c90dbe7dbd914df17d2446a80ae60',
                            store: store
                             }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', home.home);
app.post('/', home.home_post_handler);


app.get('/user/:id', pages.my_pages)
app.post('/user/:id', pages.my_pages_post_handler)
//app.get('/users', home.search)

app.get('/user/:id/edit', pages.edit_profile)
app.post('/user/:id/edit', pages.edit_profile_post_handler)

app.get('/user/:user/:page', pages.page_view);
app.post('/user/:user/:page', pages.page_view_post_handler)

app.get('/user/:user/:page/delete', pages.page_delete);
app.post('/user/:user/:page/delete', pages.page_delete_post_handler);

app.get('/user/:user/upload/file', pages.file_upload)
app.post('/user/:user/upload/file', pages.file_upload_post_handler)

app.get('/user/:user/:page/edit', pages.file_edit);
app.post('/user/:user/:page/edit', pages.file_edit_post_handler);

app.get('/signup', signup.signup);
app.post('/signup', signup.signup_post_handler);

app.get('/_signup', signup.failure_success);


app.get('/contact', home.page_contact);

app.get('/logout', function(req, res) {
    delete req.session.username;
    username = undefined; 
    console.log(username);
    res.redirect('/');
});
app.use(function(req,res) { 
    res.render('404', 
               { locals: {'title':'Ninjapages url is Not Found'}, }, 
               function(err,str) { res.send(str,404); 
               }
); 
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Ninjapages server listening on port " + app.get('port'));
});
