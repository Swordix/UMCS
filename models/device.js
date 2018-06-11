var mongodb = require('../modules/mongodb.js');
var Schema = mongodb.mongoose.Schema;


var deviceSchema = new Schema({
  sn_cpu: String,
  type: Number,
  dev_address: Number,
  create_date: { type: Date, default: Date.now },
  child: [{
          sn: String,
          family: Number,
          data: { type: String },
          name: String,
          options: Number,
          bad: Number,
          div: Number,
          _id: false
  }],
  volt: String
},{ versionKey: false });

var device = mongodb.mongoose.model("device", deviceSchema);
