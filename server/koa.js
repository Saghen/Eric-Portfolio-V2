'use strict'

const config = require('Config');
const logger = require('Logger');

const Koa = require('koa');
const app = new Koa();

const path = require('path');

const send = require('koa-send');
const favicon = require('koa-favicon');
const compress = require('koa-compress');
const cors = require('@koa/cors');

function addGlobals() {
  app.context.build = require('Helpers/reqHelper').buildRes;
  app.context.buildError = require('Helpers/reqHelper').buildError;
  app.context.db = require('Core/mongo')();
}

function middleware() {
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.buildError({
        status: err.statusCode || err.status || 500,
        errors: [
          {
            key: 'internal',
            message: 'An internal server error occured'
          }
        ]
      });
      logger.error(ctx.path)
      logger.error(err)
      throw err;
    }
  });

  if (config.mode == 'development') {
    app.use(cors());
  }

  app.use(compress());
  app.use(favicon(path.join(__dirname, '../client/dist/favicon.ico')));
}

function routes() {
  app.use(require('Routes/api').middleware());

  // Images
  app.use(require('Routes/images').middleware());

  // Static
  app.use(
    require('koa-static')(path.join(__dirname, '../client/dist/'), {
      maxage: 1000 * 60 * 5 // 5 minutes
    })
  );

  // Serve the Vue file if nothing else
  app.use(async ctx => {
    await send(ctx, 'index.html', {
      root: path.join(__dirname, '../client/dist/')
    });
  });
}

module.exports = function() {
  addGlobals();

  middleware();
  routes();

  return app;
};
