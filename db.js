var date = new Date();
var dd = date.getDate()
var mm = date.getMonth() + 1
var yyyy = date.getFullYear()
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} date = mm+'/'+dd+'/'+yyyy; 
console.log('Date: '+ date)

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
    password1: String,
    bio: String,
    site: String

})

var pageSchema = new Schema({
	id: ObjectId,
    title: String,
	page_code: String,
	user: String,
    created: String,
    file: { data: Buffer, contentType: String }
})


var user = db.model('user', userSchema);
var page = db.model('page', pageSchema);
