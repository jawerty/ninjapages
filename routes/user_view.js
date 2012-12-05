var t = 'Ninjapages';
require( '../db' );
var mongoose = require( 'mongoose' );

exports.index = function(req, res){
	res.render('user_view', {title: 'User | ' + t, username:req.session.username})
}