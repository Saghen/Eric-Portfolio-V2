'use strict'

const logger = require('Core/logger');
const apiLogger = require('koa-logger');

module.exports = async function(Koa) {
  const db = require('Core/mongo')();

  Koa.use(apiLogger((str, args) => {
    if (!/\/api\/*./.test(args[2])) return;
    logger.debug(str);
  }))

  Koa.use(require('./api/blog').middleware());
  Koa.use(require('./api/auth').middleware());
}
