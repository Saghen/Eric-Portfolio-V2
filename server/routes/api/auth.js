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

const auth = require('Helpers/auth');

const router = Router({
  errorHandler: reqHelper.routerErrorHandler
});

router.prefix('/auth');

router.route({
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

    ctx.build({
      message: 'Successfully added account'
    });
  }
});

router.route({
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

router.route({
  method: 'get',
  path: '/get',
  //prettier-ignore
  validate: {
    query: Joi.object({
      self: Joi.boolean(),
      email: Joi.string().email()
    }).xor('self', 'email')
  },
  pre: auth.jwtMiddlewareContinue(),
  handler: ctx => {
    const query = ctx.query
    if (query.self) {
      if (typeof ctx.state.user !== 'object')
        ctx.buildError({
          status: HttpStatus.FORBIDDEN,
          errors: [{
            key: 'token',
            message: 'Please login to continue'
          }]
        }) 
    }
  }
})

module.exports = router;
