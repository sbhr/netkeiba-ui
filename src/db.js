const model = require('./model.js');

const insert = (raceData) => {
  const Race = model.Race;
  const race = new Race({
    date: raceData.date,
    place: raceData.place,
    num: raceData.num,
    data: raceData.data,
  });

  race.save((err) => {
    if (err) { console.log(err); }
  });
};

exports.insert = insert;
