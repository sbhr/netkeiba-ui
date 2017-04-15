const model = require('./model');
const Logger = require('./logger');

const insert = (raceData) => {
  const Race = model.Race;
  const race = new Race({
    date: raceData.date,
    place: raceData.place,
    num: raceData.num,
    data: raceData.data,
  });

  race.save((err) => {
    if (err) { Logger.errorLog('error', err.message); }
  });
};

exports.insert = insert;
