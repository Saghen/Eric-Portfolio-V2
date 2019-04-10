'use strict';

const config = require('Config/');

const Router = require('koa-joi-router');
const Joi = Router.Joi;

const C = require('Constants');
const Post = require('Models/post');

const reqHelper = require('Helpers/reqHelper');
const auth = require('Helpers/auth');
const HttpStatus = require('http-status-codes');

const fs = require('fs-extra');
const path = require('path');

const images = Router({
  errorHandler: reqHelper.routerErrorHandler
});

images.prefix('/images');

images.route({
  method: 'put',
  path: '/insert',
  pre: auth.jwtMiddleware(),
  validate: {
    type: 'multipart'
  },
  async handler(ctx) {
    const parts = ctx.request.parts;

    let part = await parts;

    if (!part)
      return ctx.buildError({
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            key: 'file',
            message: 'A file was not provided'
          }
        ]
      });

    const filename = part.filename;
    const extension = (filename.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];

    const existingImages = await fs.readdir(config.images.imagesPath);

    if (existingImages.some(val => val === part.filename))
      return ctx.buildError({
        status: HttpStatus.CONFLICT,
        errors: [
          {
            key: 'image',
            message: 'An image with that name already exists'
          }
        ]
      });

    if (!/png|jpg|jpeg|webp/.test(extension))
      return ctx.buildError({
        status: HttpStatus.BAD_REQUEST,
        errors: [
          {
            key: 'image',
            message:
              'The image uses an unsupported file format. Please use png, jpg, jpeg, webp, gif, or apng.'
          }
        ]
      });

    const imagePath = path.join(config.images.uploadsTempPath, filename);

    do {
      part.pipe(fs.createWriteStream(imagePath));
    } while ((part = await parts));

    await fs.move(imagePath, path.join(config.images.uploadsPath, filename));

    ctx.build({
      message: 'Successfully uploaded file'
    });
  }
});

images.route({
  method: 'get',
  path: '/list',
  async handler(ctx) {
    ctx.build({ data: await fs.readdir(config.images.imagesPath) });
  }
});

images.route({
  method: 'delete',
  path: '/delete',
  pre: auth.jwtMiddleware(),
  validate: {
    type: 'json',
    body: {
      filename: Joi.string()
        .trim()
        .required()
    }
  },
  async handler(ctx) {
    const folder = path.join(
      config.images.imagesPath,
      ctx.request.body.filename
    );

    if (!(await fs.exists(folder)))
      return ctx.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            key: 'filename',
            message: 'The specified image was not found'
          }
        ]
      });

    await fs.remove(folder);

    ctx.build({
      message: 'Successfully deleted image'
    });
  }
});

module.exports = images;
