const log4js = require('log4js');
const config = require('../config/log_config.json');

log4js.configure(config);
const scrapeLogger = log4js.getLogger('scrape');
const serverLogger = log4js.getLogger('server');
const errorLogger = log4js.getLogger('error');
const TRACE_BACK_TIMES = 3;

class Logger {

  static getTrace() {
    const trace = (new Error()).stack.split('\n')[TRACE_BACK_TIMES].trim();
    const func = trace.split(' ')[1];
    const file = trace.split(' ')[2].split('/').pop().split(':')[0];
    const line = trace.split(' ')[2].split('/').pop().split(':')[1];
    return { func, file, line};
  }

  static scrapeLog(level, msg) {
    const trace = Logger.getTrace();
    const logMessage = `[${trace.file}] [${trace.func}:${trace.line}] ${msg}`;
    scrapeLogger[level](logMessage);
  }

  static serverLog(level, msg) {
    const trace = Logger.getTrace();
    const logMessage = `[${trace.file}] [${trace.func}:${trace.line}] ${msg}`;
    serverLogger[level](logMessage);
  }

  static errorLog(level, msg) {
    const trace = Logger.getTrace();
    const logMessage = `[${trace.file}] [${trace.func}:${trace.line}] ${msg}`;
    errorLogger[level](logMessage);
  }
}

module.exports = Logger;
