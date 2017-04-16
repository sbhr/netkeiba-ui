const MongoClient = require('../lib/mongo-client');
const Util = require('../lib/util');

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

module.exports = {
  getIndex,
};
