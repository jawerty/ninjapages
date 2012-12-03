t = 'Ninjapages'
require( '../db' );
fs = require('fs');
var mongoose = require( 'mongoose' );
var user     = mongoose.model( 'user' );
var page     = mongoose.model( 'page' );
var sleep = require('sleep')
var failure3;
var failure4;
var failure5;
var failure1;
var win;
/**Date config**/
var date = new Date();
var dd = date.getDate()
var mm = date.getMonth()
var yyyy = date.getFullYear()
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} date = mm+'/'+dd+'/'+yyyy; 
/**end Date config**/

var eight_char = "12345678";
var twenty_six_char = "12345678912345678912345678";

function sleepRedirect(x, y){
	sleep.sleep(x);
	res.redirect(y)
}
exports.my_pages = function(req, res){
 var usern = req.params.id;
 if(user.findOne({"user_name": usern}, function(err, username){
 	if(username){
 		page.find({"user": usern}, function(err, pages){
 			if(pages){
 				user.findOne({"user_name": usern}, function(err, users){
 					res.render('user_pages', {
		 				title: usern + '\'s Page | ' + t, 
		 				user: usern,
		 				pages:pages,
		 				users:users,
		 				failure:failure4
 					})
 					failure4 = null
 				})
 				
 			}else{
	 			res.render('user_pages', {
	 				title: usern + '\'s Page | ' + t, 
	 				user: usern, 
	 				pages:null,
	 				failure:failure4
	 			});
	 			failure4 = null
 			}
 		});
 	}else{

 		failure3 = 'User does not exist. Redirecting to home in a few seconds';
 		res.render('pages_error', {title: 'PagesError | ' + t, failure: failure3})
 		
 	}
 }));
}
exports.my_pages_post_handler = function(req, res){
	var usern = req.params.id;
	var title1 = req.body.title; 

	
	if (title1=='' || title1 == ' ' || typeof title1 == 'undefined'){
		failure4 = 'Please add a Title'
		console.log('publish error')
	}else{
		console.log('title is not empty')
		
		
			var newPage = new page({ 
			title: title1,
	        page_code: req.body.code,
			user: req.session.username,
			created: date

	    	});
	    	newPage.save();
	    	console.log('non-file uploaded')
	
	}

    
    res.redirect('/user/'+ usern);
}

exports.edit_profile = function(req, res){
	u = req.params.id;
	if(req.session.username==u){
		res.render('edit_profile', {title: 'Edit Profile | ' + t, failure:failure1})
	}else{
		res.redirect('/')
	}
	
	
}
exports.edit_profile_post_handler = function(req, res){
	u = req.params.id;
	newEmail = req.body.newemail;
	newPass = req.body.newpass;
	newPassConfirm = req.body.newpassconfirm;
	bio = req.body.bio;
	website = req.body.website;
	



	if (website=='' || website==' ' || typeof website == 'undefined'){
		console.log('No website was passed')
	}else{
		user.findOne({"user_name":u}, function(err, username){
			
			username.site = website;
			
			username.save(function(err, usernames){

			});
		});		
		console.log('updated website')
	}


	if(bio==''|| bio==' ' || typeof bio == 'undefined'){
		console.log('No Bio was passed')
	}else{
		user.findOne({"user_name":u}, function(err, username){
			
			username.bio = bio;
			console.log(username.bio)
			username.save(function(err, usernames){

			});
		});	
		console.log('updated bio')
	}


	if(newEmail==''|| newEmail==' ' || typeof newEmail == 'undefined'){
		console.log('No email was passed')
	}else{
		user.findOne({"user_name":u}, function(err, username){
			
			username.email = newEmail;
			
			username.save(function(err, usernames){

			});
		});	
		console.log('updated email')		
	}

	/**Password Edit**/
	if(newPass==''|| newPass==' ' || typeof newPass == 'undefined'){
		console.log('new password not asked for')
		res.redirect('/user/'+req.params.id)
	}else{
		if(newPass.length < eight_char.length || newPass.length > twenty_six_char.length){
			console.log('password length is not valid');
	        failure1 = 'Password length must be from 8 to 26 characters';
	        console.log(failure1);
	        res.redirect('/user/'+req.params.id+'/edit');
		}else{
			if(newPass!=newPassConfirm){
				failure1 = 'Passwords do not match';
				res.redirect('/user/'+req.params.id+'/edit');
				console.log('Passwords don\'t match')
			}else{
				user.findOne({"user_name":u}, function(err, username){
					username.password1 = newPass;
					username.save(function(err, usernames){
					});
				});	
				console.log('updated password')	
				res.redirect('/user/'+req.params.id)
			}
		}
	}
	
	
}

exports.page_view = function(req, res){
usern = req.params.user;
title = req.params.page;
 if(user.findOne({"user_name": usern}, function(err, username){
 	if(username){
 		page.findOne({"user": usern, "title":title}, function(err, page){

 			if(page){
 				code = page['page_code'];
 				
 				console.log(code)
 				res.send(code);
 				
 				console.log('running code')
 			}else{
	 	 		res.render('user_pages', {
	 				page:null
	 			});
 			}
 		});
 	}else{
 		res.redirect('/')
 	}
 }));

}
exports.page_view_post_handler = function(req, res){

}


exports.page_delete = function(req, res){
	u = req.params.user;
	p = req.params.page;
	if(req.session.username==u){
		page.findOne({"user": u, "title":p}, function(err, pageTrue){
			if(pageTrue){
				pageTrue.remove()
				console.log('removed')
				res.redirect('/user/'+u)
			}else{
				res.redirect('/user/'+u)
			}
		});


	}else{
		res.redirect('/user/'+u)
	}
}
exports.page_delete_post_handler = function(req, res){

}
exports.file_upload = function(req, res){
u = req.params.user;

	if(req.session.username==u){
		res.render('file_upload', {title: 'File Upload | ' + t, user:u, failure:failure5, win:win})
		failure5 = null;
		win = null;
	}else{
		res.redirect('/')
	}
}
exports.file_upload_post_handler = function(req, res){
	u = req.params.user;
	p = req.params.page;
	t = req.body.title1;
	html = req.files.html_file.path;
	console.log('psuedo')
	if (t=='' || t == ' ' || typeof t == 'undefined'){
		failure5 = 'Please add a Title'
		console.log('publish file error')
		res.redirect('/user/'+u+'/upload/file')
	}else{
		if(req.files.html_file.type == 'text/html'){
			fs.readFile(html, 'utf8', function(err, data){
				if(err){
					console.log(err)
				}
				var newPage = new page({ 
				title: t,
			    page_code: data,
				user: req.session.username,
				created: date

			  	});
			   	newPage.save();
			   	console.log('file uploaded');
			   	failure5 = null;
			   	win = 'File upload completed...'
			   	res.redirect('/user/'+u+'/upload/file')
				
			});
		}else{
			failure5 = 'Incorrect file format (only HTML files allowed)';
			console.log('File format incorrect');
			res.redirect('/user/'+u+'/upload/file')
		}

	}

}