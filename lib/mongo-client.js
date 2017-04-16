const mongoose = require('mongoose');
const config = require('config');
const Logger = require('./logger');
const Util = require('./util');

const RaceSchema = new mongoose.Schema({
  date: Date,
  place: String,
  num: Number,
  data: Array,
});

mongoose.connection.on('open', () => {
  Logger.scrapeLog('info', 'Connected to mongo server.');
});
mongoose.connection.on('error', (err) => {
  Logger.errorLog('error', 'Could not connect to mongo server!');
  Logger.errorLog('error', err,message);
});

class MongoClient {
  constructor() {
    this.host = config.get('db.host');
    this.port = config.get('db.port');
    this.database = config.get('db.name');
    this.user = config.get('db.user');
    this.password = config.get('db.password');
    this.uri = `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.database}`;
    this.Race = mongoose.model('Race', RaceSchema);
    this.connect();
  }

  connect() {
    mongoose.connect(this.uri, (err) => {
      if (err) Logger.errorLog('error', err.message);
    });
  }

  insertRaceDatas(raceDatas) {
    for (let i = 0; i < raceDatas.length; i += 1) {
      const race = new this.Race({
        date: raceDatas[i].date,
        place: raceDatas[i].place,
        num: raceDatas[i].num,
        data: raceDatas[i].data,
      });
      race.save((err) => {
        if (err) Logger.errorLog('error', err.message);
        if (i === raceDatas.length - 1) {
          // TODO: 今のところ全部入っているが、
          // 遅延や量によって入らなそう(要改善)
          mongoose.disconnect();
        }
      });
    }
  }

  getAllRaceDate() {
    return new Promise((resolve, reject) => {
      this.Race.find().distinct('date', (err, result) => {
        if (err) {
          Logger.errorLog('error', err.message);
          reject(err);
        }
        resolve(result);
      });
    });
  }

  getRaceDataByDate(date) {
    return new Promise((resolve, reject) => {
      const param = Util.convertIntoISODate(Util.convertIntoUTC(`${date} 00:00:00+09:00`));
      const query = {date: param};
      this.Race.find(query, (err, result) => {
        if (err) {
          Logger.errorLog('error', err.message);
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = MongoClient;
