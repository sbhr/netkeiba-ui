const mongoose = require('mongoose');
const config = require('config');

const Schema = mongoose.Schema;

const RaceSchema = new Schema({
  date: Date,
  place: String,
  num: Number,
  data: Array,
});

const HOST = config.get('db.host');
const PORT = config.get('db.port');
const DATABASE = config.get('db.name');

mongoose.connect(`mongodb://${HOST}:${PORT}/${DATABASE}`, {
  server: {
    socketOptions: {
      socketTimeoutMS: 0,
      connectionTimeout: 0,
    },
  },
});
exports.Race = mongoose.model('Race', RaceSchema);
