var mongodb = require('../modules/mongodb.js');
var Schema = mongodb.mongoose.Schema;

var userSchema = new Schema({
    name: String,
    psw: String,
    data: {
	    email: String,
	    fullName: String,
	    address: String,
	    city: String,
	    country: String,
	    access: String,
	},
	_id: false
});

var user = mongodb.mongoose.model("user", userSchema);