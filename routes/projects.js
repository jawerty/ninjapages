t = 'Ninjapages'
require( '../db' );
var mongoose = require( 'mongoose' );
var user     = mongoose.model( 'user' );
var sleep = require('sleep')
var failure3;

function sleepRedirect(x, y){
	sleep.sleep(x);
	res.redirect(y)
}
exports.my_projects = function(req, res){
 var usern = req.params.id;
 if(user.findOne({"user_name": usern}, function(err, usernames){
 	if(usernames){
 		res.render('user_projects', {title: usern + '\'s Projects | ' + t, user: usern})
 	}else{

 		failure3 = 'Username does not exist. Redirecting to home in a few seconds';
 		res.render('projects_error', {title: 'ProjectsError | ' + t, failure: failure3})
 		
	    
 	}
 }));
}
exports.my_projects_post_handler = function(req, res){

}
