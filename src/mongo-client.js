const mongoose = require('mongoose');
const config = require('config');
const logger = require('./logger');

const RaceSchema = new mongoose.Schema({
  date: Date,
  place: String,
  num: Number,
  data: Array,
});

mongoose.connection.on('open', () => {
  logger.scrape.info('Connected to mongo server.');
});
mongoose.connection.on('error', (err) => {
  logger.error.error('Could not connect to mongo server!');
  logger.error.error(err);
});

class MongoClient {
  constructor() {
    this.host = config.get('db.host');
    this.port = config.get('db.port');
    this.database = config.get('db.name');
    this.user = config.get('db.user');
    this.password = config.get('db.password');
    this.uri = `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    this.Model = mongoose.model('Race', RaceSchema);
  }

  insert(raceDatas) {
    mongoose.connect(this.uri, (err) => {
      if (err) {
        logger.error.error(err);
      } else {
        for (let i = 0; i < raceDatas.length; i += 1) {
          const race = new this.Model({
            date: raceDatas[i].date,
            place: raceDatas[i].place,
            num: raceDatas[i].num,
            data: raceDatas[i].data,
          });
          race.save((error) => {
            if (error) logger.error.error(error);
            if (i === raceDatas.length - 1) {
              // TODO: 今のところ全部入っているが、
              // 遅延や量によって入らなそう(要改善)
              mongoose.disconnect();
            }
          });
        }
      }
    });
  }
}

module.exports = MongoClient;
