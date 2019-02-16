'use strict';

let logger = require('./logger');
let config = require('../config');

let chalk = require('chalk');
let mongoose = require('mongoose');

module.exports = function () {
  let db;

  mongoose.Promise = global.Promise;

  if (mongoose.connection.readyState !== 1) {
    logger.info('Connecting to Mongo ' + config.db.uri + '...');
    db = mongoose.connect(config.db.uri, config.db.options, function mongoAfterConnect(err) {
      if (err) {
        logger.error('Could not connect to MongoDB!');
        return logger.error(err);
      }

      mongoose.set('debug', config.isDevMode());
    });

    mongoose.connection.on('error', function mongoConnectionError(err) {
      if (err.message.code === 'ETIMEDOUT') {
        logger.warn('Mongo connection timeout!', err);
        setTimeout(() => {
          mongoose.connect(config.db.uri, config.db.options);
        }, 1000);
        return;
      }

      logger.error('Could not connect to MongoDB!');
      return logger.error(err);
    });

    mongoose.connection.once('open', function mongoAfterOpen() {
      logger.info(chalk.yellow.bold('Mongo DB connected.'));
      logger.info('');
      if (!config.isProduction) {
        require('./seed-db')();
      }
    });


  } else {
    logger.info('Mongo already connected.');
    db = mongoose;
  }

  return db;
};