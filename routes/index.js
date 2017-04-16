const express = require('express');

const router = express.Router();
const index = require('../controllers/index');

router.get('/', index.getIndex);
router.get('/data/:date', index.getRaceData);

module.exports = router;
