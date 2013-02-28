t = 'ninjapages'
require( '../db' );
var sleep = require('sleep')
var fs = require('fs');
var unzip = require('unzip');
var mongoose = require( 'mongoose' );

var user     = mongoose.model( 'user' );
var page     = mongoose.model( 'page' );

var failure1;
var failure3;
var failure4;
var failure5;
var failure6;

var win;

/**Date config**/
var date = new Date();
var dd = date.getDate()
var mm = date.getMonth() + 1
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
		 				title: usern + ' | ' + t, 
		 				user: usern,
		 				pages:pages,
		 				users:users,
		 				failure:failure4,
		 				username:req.session.username
 					})
 					failure4 = null
 				})
 				
 			}else{
	 			res.render('user_pages', {
	 				title: usern + ' | ' + t, 
	 				user: usern, 
	 				pages:null,
	 				failure:failure4,
	 				username:req.session.username
	 			});
	 			failure4 = null
 			}
 		});
 	}else{

 		failure3 = 'User does not exist. Redirecting to home in a few seconds';
 		res.render('pages_error', {title: 'PagesError | ' + t, username:req.session.username, failure: failure3})
 		
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
		
		page.findOne({'title': title1, "user": usern}, function(err, match){
			if(match){
				failure4 = 'You already have a page with that title'
				console.log('publish(title exists among user) error')
			}else{
				title1 = title1.replace(/ /g,"_");
				var newPage = new page({ 
				title: title1,
		        page_code: req.body.code,
				user: req.session.username,
				created: date

		    	});
		    	newPage.save();
		    	console.log('non-file uploaded')
			}
		});
			
	
	}

    
    res.redirect('/user/'+ usern);
}

exports.edit_profile = function(req, res){
	u = req.params.id;
	if(req.session.username==u){
		res.render('edit_profile', {title: 'Edit Profile | ' + t, username:req.session.username, failure:failure1})
		failure1 = null;
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
 				if (page['page_code'] == null){
 										
					//nothing

 				}else{
 					code = page['page_code'];
 					
 					console.log(code)
 					res.send(code);

 					console.log('running code') 					
 				}

 			}else{
	 	 		res.render('user_pages', {
	 	 			username:req.session.username,
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
		res.render('file_upload', {title: 'File Upload | ' + t, user:u, username:req.session.username, failure:failure5, win:win})
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
	console.log(html)
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
				t = t.replace(/ /g,"_");
				var newPage = new page({ 
				title: t,
			    page_code: data,
				user: req.session.username,
				created: date,
				file: null

			  	});
			   	newPage.save();
			   	console.log('file uploaded');
			   	failure5 = null;
			   	win = 'Single file upload completed...'
			   	res.redirect('/user/'+u+'/upload/file')
				
			});
		}
		else if(req.files.html_file.type == 'application/zip'){
			/*
			var newPage = new page({ 
				title: t,
			    page_code: null,
				user: req.session.username,
				created: date

		 	});
			newPage.file.data = fs.readFileSync(html);
			newPage.file.contentType = 'application/zip';
			console.log(newPage.file.data);
			newPage.save();

			console.log('saved zip');
			*/
			win = 'Zip file upload is currently in production (Sorry for the inconvenience...'
			res.redirect('/user/'+u+'/upload/file')
		}else{
			failure5 = 'Incorrect file format (only HTML files and zipped folders allowed)';
			console.log('File format incorrect');
			res.redirect('/user/'+u+'/upload/file')
		}
	}
}

exports.file_edit = function(req, res){
	u = req.params.user;
	p = req.params.page;
	if(req.session.username==u){
		page.findOne({title: p}, function(err, page){
			if(page){
				res.render('edit_page', {title: p +' Edit | ' + t, user:u, pages:page, failure6: failure6, username:req.session.username, failure6:failure6})
			}else{
				res.redirect('/')
			}
		})
	}else{
		res.redirect('/');
	}
}
exports.file_edit_post_handler = function(req, res){
	u = req.params.user;
	p = req.params.page;
	code = req.body.code;

	user.findOne({user_name: u}, function(err, user){
		if (user){
			page.findOne({title: p}, function(err, page){
				if (page){
					page.page_code = code;
					page.save();
					console.log('Page edited');
					res.redirect('/user/' + u);
				}else{
					failure6 = 'Page not found'
					console.log('page not found in file edit')
					res.redirect('/user/' + u + '/' + p+ '/edit')
				}
			})
		}else{
			failure6 = 'User not found'
			console.log('user not found in file edit')
			res.redirect('/user/' + u + '/' + p+ '/edit')
		}
	})
}