var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/umcs', { useMongoClient: true });
exports.mongoose = mongoose;
