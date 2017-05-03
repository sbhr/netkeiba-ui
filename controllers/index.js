const MongoClient = require('../lib/mongo-client');
const Util = require('../lib/util');
const Filter = require('../lib/filter');

const mongoClient = new MongoClient();

const getIndex = (req, res, next) => {
  mongoClient.getAllRaceDate()
  .then((ret) => {
    const raceDates = ret.map(x => Util.convertIntoJST(x)).reverse();
    res.render('index', {
      title: 'netkeiba search',
      raceDates,
    });
  })
  .catch((err) => next(err));
};

const getRaceData = (req, res, next) => {
  const raceDate = req.params.date;
  mongoClient.getRaceDataByDate(raceDate)
  .then((ret) => {
    res.send(ret);
  })
  .catch((err) => next(err));
};

const filterRaceDatas = (req, res, next) => {
  const filter = new Filter(req.body.forecast, req.body.postData);
  filter.applyFileter();
  res.json(filter.raceDatas);
};

module.exports = {
  getIndex,
  getRaceData,
  filterRaceDatas
};
