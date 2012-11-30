var mongoose = require('mongoose')
var Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

var db_url = process.env.MONGOLAB_URI || "http://localhost:27017/ninjapagesDB", 
    db = mongoose.connect(db_url);


var userSchema = new Schema({
    id: ObjectId,
    first: String,
    last: String,
    email: String,
    user_name: String,
    password1: String


})
var pageSchema = new Schema({
	id: ObjectId,
	page_code: String,
	user: String
})
var user = db.model('user', userSchema);
var page = db.model('page', pageSchema);