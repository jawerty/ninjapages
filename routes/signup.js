/**DEPENDENCIES**/
require( '../db' );
var mongoose = require( 'mongoose' );
var regex_email = require('../regex_email');
var user     = mongoose.model( 'user' );
var crypto = require('crypto');
var failure2;
/****************/
var t = 'Ninjapages';
exports.signup = function(req, res){

	res.render('signup', {title: 'Sign Up | ' + t, username:req.session.username, failure:null});
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


    if(password1.length < eight_char.length || password1.length > twenty_six_char.length){

        console.log('password length is not valid');
        failure2 = 'Password length must be from 8 to 26 characters';
        console.log(failure2);
        res.redirect('/signup-failure');

    }else{
        console.log('password length is fine.');

        if (password1 != password2) {
        failure2 = 'Passwords do not match';
        res.redirect('/signup-failure');
        

        }else{
            if(regex_email.isRFC822ValidEmail(email)){
                console.log('valid email'); 
                if (first == "" || last == "" || email == "" || password1 == "" || password2 == "" || newUsername == ""){
                    console.log('Empty field');
                    failure2 = 'You left a field empty.';
                    res.redirect('/signup-failure');
                }else{
                    user.findOne({user_name: newUsername}, function(err, usernames) {
                        if (usernames) { 
                            console.log("user exists");
                            failure2 = 'Username already exists';
                            res.redirect('/signup-failure');

                        } else { 
                            console.log("user doesn't exist :)");
                            user.findOne({email: email}, function(err, emails) {
                                if (emails){
                                    console.log('email exists');
                                    failure2 = 'Email already exists';
                                    res.redirect('/signup-failure');
                                }else{
                                    var newUser = new user({ 
                                            first: first,
                                            last: last,
                                            email: email,
                                            user_name: newUsername,
                                            password1: password1,
                                            bio: 'I have no Bio',
                                            site: null
                                    });
                                    newUser.save();

                                    console.log(newUser + "has been initiated.");
                    
                                    res.redirect('/signup-success');
                                }
                            });
                            
                        }
                    });
                }
            }else{
               console.log('invalid email');
               failure2 = "Invalid email account.";
               res.redirect('/signup-failure');
            }      
        }
    }
};


exports.success = function(req, res){
	res.render('signupSuccess', {title: 'Successful Signup | ' + t, username:req.session.username})
}
exports.failure = function(req, res){
	res.render('signup', {title: 'Failed Signup | ' + t, username:req.session.username,failure:failure2})
}