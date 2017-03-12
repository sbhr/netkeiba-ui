const log4js = require('log4js');

const logger = exports;

log4js.configure({
  appenders: [
    {
      type: 'dateFile',
      category: 'scrape',
      filename: './logs/scrape.log',
      pattern: '-yyyy-MM-dd',
    },
    {
      type: 'dateFile',
      category: 'error',
      filename: './logs/error.log',
      pattern: '-yyyy-MM-dd',
    },
    {
      type: "console"
    },
  ],
});

logger.scrape = log4js.getLogger('scrape');
logger.error = log4js.getLogger('error');
