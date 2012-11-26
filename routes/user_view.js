var t = 'Ninjapages';
exports.index = function(req, res){
	res.render('user_view', {title: 'User | ' + t})
}