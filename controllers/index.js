const getIndex = (req, res, next) => {
  res.render('index', { title: 'Express', content: 'test' });
};

module.exports = {
  getIndex,
};
