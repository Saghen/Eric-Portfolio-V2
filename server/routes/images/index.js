'use strict'

const config = require('Config/');

const Router = require('koa-joi-router');
const Joi = Router.Joi;

const send = require('koa-send');

const User = require('Models/user');

const reqHelper = require('Helpers/reqHelper');
const HttpStatus = require('http-status-codes');

const fs = require('fs-extra');
const path = require('path');

const images = Router();

images.prefix('/images');

images.router.all('*', async (ctx, next) => {
  await next();
  if (ctx.status !== 404) return;
  ctx.buildError({
    status: 404,
    errors: [
      {
        key: 'url',
        message: `The image was not found`
      }
    ]
  });
});

images.route({
  method: 'get',
  path: '/:file',
  validate: {
    query: {
      size: Joi.number()
    }
  },
  handler: async (ctx, next) => {
    const filename = ctx.params.file;
    const extension = (filename.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];

    const folder = path.join(config.images.imagesPath, filename);

    if (!await fs.exists(folder)) return next();

    let file;
    if (ctx.query.size) {
      file = path.join(folder, `${ctx.query.size}.${extension}`);
      if (!await fs.exists(file)) file = path.join(folder, `base.${extension}`);;
    }
    else
      file = path.join(folder, `base.${extension}`);
    
    if (!await fs.exists(file)) return next();

    await send(ctx, file, { root: '/'});
  }
})

module.exports = images;
