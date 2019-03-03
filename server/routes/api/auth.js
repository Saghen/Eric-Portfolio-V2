const router = require('koa-joi-router');
const Joi = router.Joi;

const auth = router();

const User = require('Models/user');
const db = require('Core/mongo');

const reqHelper = require('Helpers/reqHelper');
const HttpStatus = require('http-status-codes');
const RateLimit = require('koa2-ratelimit').RateLimit;
const crypto = require('crypto');

const mailer = require('Root/services/mailer');

auth.prefix('/api/auth');

auth.route({
  method: 'post',
  path: '/signup',
  // prettier-ignore
  validate: {
    type: 'form',
    body: {
      firstName: Joi.string().trim().min(1).required(),
      lastName: Joi.string().trim().min(1).required(),
      email: Joi.string().trim().email().required(),
      password: Joi.string().min(8).regex(/(.*[a-z].*)/).regex(/(.*[A-Z].*)/).regex(/(.*\d.*)/).required(),
      profileImage: Joi.string().trim().lowercase()
    },
    continueOnError: true
  },
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    let user = new User(ctx.request.body);

    if (await User.findOne({ email: user.email })) {
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = reqHelper.buildError({
        errors: [
          { key: 'email', message: 'A user with that email already exists' }
        ],
        status: HttpStatus.CONFLICT
      });
      return;
    }

    do {
      token = crypto.randomBytes(16).toString('hex');
    } while (await User.findOne({ sessionToken: token }));

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
  // prettier-ignore
  validate: {
    type: 'form',
    body: {
      email: Joi.string().trim().email(),
      password: Joi.string().min(8).regex(/(.*[a-z].*)/).regex(/(.*[A-Z].*)/).regex(/(.*\d.*)/)
    }
  },
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      ctx.status = 400;
      ctx.body = reqHelper.buildError({
        errors: [
          {
            key: 'email',
            message: 'The provided email is not associated with a user'
          }
        ]
      });
    }

    if (!user.comparePassword(user.password)) return;

    let token;

    do {
      token = crypto.randomBytes(64).toString('hex');
    } while (await User.findOne({ sessionToken: token }));

    user.token = token;

    try {
      user.save();
    } catch (err) {
      console.error(err);
    }
    

    ctx.cookies.set('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 60
    });

    ctx.body = reqHelper.build({
      message: 'Successfully logged in'
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
    if (!(await reqHelper.verifyRoute(ctx))) return;

    const query = ctx.request.query;

    const user = await User.findOne({ email: query.email, verifyToken: query.token });

    if (!user) {
      ctx.status = 400;
      ctx.body = reqHelper.buildError({
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

auth.get('/resetPassword', async ctx => {
  ctx.body = 'Yo';
});

auth.get('/changePassword', async ctx => {
  ctx.body = 'Yo';
});

module.exports = auth;

// postedBy: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
// title: Joi.string().invalid()
