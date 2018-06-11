var mongodb = require('../modules/mongodb.js');
var Schema = mongodb.mongoose.Schema;

var connectSchema = new Schema({
    id: String,
    name: String,
    x: String,
    y: String,
    in_net: ['', '', '', ''],
    in_val: ['', '', '', ''],
    _id: false
});

var connect = mongodb.mongoose.model("connect", connectSchema);