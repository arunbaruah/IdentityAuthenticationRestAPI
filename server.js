let port = 8080;
let server = require('./appserver');
let config = require('config');
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost, { useMongoClient: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

server.listen(port);
console.log("Listening on port " + port);

