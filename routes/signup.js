/**DEPENDENCIES**/
require( '../db' );
var mongoose = require( 'mongoose' );
var regex_email = require('../regex_email');
var user     = mongoose.model( 'user' );
var crypto = require('crypto');
var failure1;
/****************/
var t = 'gamefox';
exports.signup = function(req, res){

	res.render('signup', {title: 'Sign Up | ' + t, failure:null});
};
exports.signup_post_handler = function(req, res){


var eight_char = "12345678";
var twenty_six_char = "12345678912345678912345678";

	first = req.body.first;
	last = req.body.last;
	email = req.body.email;
    password1 = req.body.password1;
    password2 = req.body.password2; 
    newUsername = req.body.username;
    bio = req.body.bio;
    fav_game = req.body.fav_game;
    fav_engine = req.body.fav_engine;
    acc_type = req.body.account_type;

    if(password1.length < eight_char.length || password1.length > twenty_six_char.length){

        console.log('password length is not valid');
        failure1 = 'Password length must be from 8 to 26 characters';
        console.log(failure1);
        res.redirect('/home/signup-failure');

    }else{
        console.log('password length is fine.');

        if (password1 != password2) {
        failure1 = 'Passwords do not match';
        res.redirect('/home/signup-failure');
        

        }else{
            if(regex_email.isRFC822ValidEmail(email)){
                console.log('valid email'); 
                if (first == "" || last == "" || email == "" || password1 == "" || password2 == "" || newUsername == "" || bio == ""){
                    console.log('Empty field');
                    failure1 = 'You left a field empty.';
                    res.redirect('/home/signup-failure');
                }else{
                    user.findOne({user_name: newUsername}, function(err, usernames) {
                        if (usernames) { 
                            console.log("user exists");
                            failure1 = 'Username already exists';
                            res.redirect('/home/signup-failure');

                        } else { 
                            console.log("user doesn't exist :)");
                            user.findOne({email: email}, function(err, emails) {
                                if (emails){
                                    console.log('email exists');
                                    failure1 = 'Email already exists';
                                    res.redirect('/home/signup-failure');
                                }else{
                                    var newUser = new user({ 
                                            first: first,
                                            last: last,
                                            email: email,
                                            user_name: newUsername,
                                            password1: password1,
                                            bio: bio,
										    fav_game: fav_game,
										    fav_engine: fav_engine,
										    account_type: acc_type
                                    });
                                    newUser.save();

                                    console.log(newUser + "has been initiated.");
                    
                                    res.redirect('/home/signup-success');
                                }
                            });
                            
                        }
                    });
                }
            }else{
               console.log('invalid email');
               failure1 = "Invalid email account.";
               res.redirect('/home/signup-failure');
            }      
        }
    }
};


exports.success = function(req, res){
	res.render('signupSuccess', {title: 'Successful Signup | ' + t})
}
exports.failure = function(req, res){
	res.render('signup', {title: 'Failed Signup | ' + t, failure:failure1})
}