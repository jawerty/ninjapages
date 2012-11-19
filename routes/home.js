/**DEPENDENCIES**/
require( '../db' );
var mongoose = require( 'mongoose' );
var user     = mongoose.model( 'user' );

/*************/
var failure1 = null;

var t = 'gamefox';

exports.index = function(req, res){
  if(typeof req.session.username == 'undefined'){
  	res.redirect('/home')
  }else{
  	res.render('home', { title: 'My Feed | ' + t , username:req.session.username});

  }

};
exports.home = function(req, res){
  res.render('layout_home', {title: 'Home | ' + t, failure1:failure1});

};
exports.home_post_handler = function(req, res){
	
    username1 = req.body.username;
    password = req.body.password;

    user.findOne({user_name: username1}, function(err, usernames) {
        if (usernames) {
            console.log('Username and exists!...');

            user.findOne({user_name: username1, password1: password}, function(err, passwords) {
                if (passwords){
                    console.log('username and password match for username, ' + username1); 

                    req.session.username = username1;
                    username = req.session.username;
                    failure1 = null;
                    res.redirect('/');
                }else{
                    console.log('username and password do not match for username, ' + username1);
                    failure1 = 'Username and password do not match.'
                    res.redirect('/home');
                }
            });
            
        }else{
            console.log('Cannot log in, username does not exist.');
            failure1 = 'Username does not exist.';
            res.redirect('/home');
        }

    });



};

exports.page_contact = function(req, res){
  res.render('contact', {title: 'Home | ' + t})
}
