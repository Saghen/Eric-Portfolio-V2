'use strict';

let winston = require('winston');
let path = require('path');
let fs = require('fs');

let config = require('../config');

let transports = [];

/**
 * Console transporter
 */
transports.push(new winston.transports.Console({
  level: config.logging.console.level,
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  handleExceptions: process.env.NODE_ENV === 'production'
}));

/** 
 * File Transporter
 */
if (config.logging.file.enabled) {
  let logDir = config.logging.file.path;
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  transports.push(new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    timestamp: true,
    json: config.logging.file.json || false,
    prettyPrint: true,
    humanReadableUnhandledException: true
  }))

  if (config.logging.file.exceptionFile) {
    transports.push(new winston.transports.File({
      filename: path.join(logDir, 'server.log'),
      level: config.logging.file.level || 'info',
      timestamp: true,
      json: config.logging.file.json || false
    }))
  }
}

// Create the logger

let logger = winston.createLogger({
  level: 'debug',
  transports: transports,
  exitOnError: false
});

// Allows the logger to take multiple arguments and combine them together similar to python's print
let wrapper = {
  ...logger,
  info(...args) { logger.info(args.join(" ")); },
  verbose(...args) { logger.verbose(args.join(" ")); },
  error(...args) { logger.error(args.join(" ")); },
  log(...args) { logger.log(args.join(" ")); },
  crit(...args) { logger.crit(args.join(" ")); },
  warn(...args) { logger.warn(args.join(" ")); }
}


module.exports = wrapper;