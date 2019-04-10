'use strict';

const config = require('Config/');

const Router = require('koa-joi-router');
const Joi = Router.Joi;

const User = require('Models/user');

const reqHelper = require('Helpers/reqHelper');
const HttpStatus = require('http-status-codes');
const RateLimit = require('koa2-ratelimit').RateLimit;
const jwt = require('jsonwebtoken');

const mailer = require('Root/services/mailer');

const auth = Router({
  errorHandler: reqHelper.routerErrorHandler
});

auth.prefix('/auth');

auth.route({
  method: 'post',
  path: '/signup',
  // prettier-ignore
  validate: {
    type: ['json', 'form'],
    body: {
      firstName: Joi.string().trim().min(1).required(),
      lastName: Joi.string().trim().min(1).required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().min(8).regex(/(.*[a-z].*)/).regex(/(.*[A-Z].*)/).regex(/(.*\d.*)/).required(),
      profileImage: Joi.string().trim().lowercase()
    }
  },
  handler: async ctx => {
    let user = new User(ctx.request.body);

    if (await User.findOne({ email: user.email })) {
      return ctx.buildError({
        errors: [
          { key: 'email', message: 'A user with that email already exists' }
        ],
        status: HttpStatus.CONFLICT
      });
    }

    await user.save();

    // send an email with the verification token 'verifyToken'
    mailer.methods.sendVerification(user.email, user, ctx);

    ctx.body = {
      success: true,
      message: 'Successfully created account'
    };
  }
});

auth.route({
  method: 'post',
  path: '/login',
  pre: RateLimit.middleware({
    interval: 1 * 60 * 1000, // 15 minutes
    max: 10
  }),
  // prettier-ignore
  validate: {
    type: 'json',
    body: {
      email: Joi.string().trim().email(),
      password: Joi.string().min(8).regex(/(.*[a-z].*)/).regex(/(.*[A-Z].*)/).regex(/(.*\d.*)/)
    }
  },
  handler: async ctx => {
    const body = ctx.request.body;

    const user = await User.findOne({ email: body.email });

    if (!user)
      return ctx.buildError({
        errors: [
          {
            key: 'email',
            message: 'The provided email is not associated with a user'
          }
        ]
      });

    if (!(await user.comparePassword(body.password)))
      return ctx.buildError({
        status: HttpStatus.FORBIDDEN,
        errors: [{ key: 'password', message: 'The password is incorrect' }]
      });

    // Add the token
    const token = jwt.sign({ email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.exp
    });

    ctx.cookies.set(config.jwt.cookie, token, config.jwt.cookieOptions);

    ctx.build({
      message: 'Successfully logged in',
      data: { token }
    });
  }
});

auth.route({
  method: 'get',
  path: '/verify',
  // prettier-ignore
  validate: {
    query: {
      email: Joi.string().email().required(),
      token: Joi.string().length(32).required()
    }
  },
  handler: async ctx => {
    const query = ctx.request.query;

    const user = await User.findOne({
      email: query.email,
      verifyToken: query.token
    });

    if (!user) {
      return ctx.buildError({
        errors: [
          {
            key: 'token,email',
            message: 'The provided email or token is not associated with a user'
          }
        ]
      });
    }

    user.verified = true;

    user.save();
  }
});

auth.get('/password/reset', async ctx => {
  ctx.body = 'Yo';
});

auth.get('/password/change', async ctx => {
  ctx.body = 'Yo';
});

module.exports = auth;
