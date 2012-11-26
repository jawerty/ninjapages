var t = 'pagefly';
exports.index = function(req, res){
	res.render('user_view', {title: 'User | ' + t})
}