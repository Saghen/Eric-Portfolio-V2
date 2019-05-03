'use strict';

const logger = require('Core/logger');
const apiLogger = require('koa-logger');

const Koa = require('koa');

const Router = require('koa-joi-router');
const Joi = Router.Joi;

const api = Router();

api.prefix('/api');

api.use(apiLogger(str => logger.debug(str)));

api.use(require('./blog/').middleware());
api.use(require('./auth').middleware());
api.use(require('./images').middleware());

api.router.all('*', async ctx => {
  if (ctx.status !== 404) return;
  ctx.buildError({
    status: 404,
    errors: [
      {
        key: 'url',
        message: `The api endpoint ${ctx.path} was not found`
      }
    ]
  });
});

module.exports = api;
