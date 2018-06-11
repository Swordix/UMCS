var mongodb = require('../modules/mongodb.js');
var Schema = mongodb.mongoose.Schema;

var settingSchema = new Schema({
    users: [{
        name: String,
        psw: String,
        root: String
    }],
    wifi: [{
        name: String,
        psw: String
    }],
    eth: [{
        ip: String,
        mask: String,
        gateway: String
    }],
    can: [{
        freq: Number,
        logic: Number
    }],
    lnf: String,
    wall: String
}, { versionKey: false });

var setting = mongodb.mongoose.model("setting", settingSchema);