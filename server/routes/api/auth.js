const router = require('koa-joi-router');
const Joi = router.Joi;

const auth = router();

const User = require('Models/user');
const db = require('Core/mongo');

const errorHelper = require('Core/errorHelper');
const HttpStatus = require('http-status-codes');
const RateLimit = require('koa2-ratelimit').RateLimit;
const crypto = require('crypto');

const mailer = require('Root/services/mailer');

auth.prefix('/api/auth');

auth.route({
  method: 'post',
  path: '/signup',
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
    if (!await errorHelper.verifyRoute(ctx)) return;

    let user = new User(ctx.request.body);

    if (await User.findOne({ email: user.email })) {
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = errorHelper.build({ ok: false, errors: [{ key: 'email', message: 'A user with that email already exists'}], status: HttpStatus.CONFLICT });
      return;
    }

    do {
      token = crypto.randomBytes(16).toString('hex');
    }
    while(await User.findOne({ sessionToken: token }))

    await user.save();

    // send an email with the verification token 'verifyToken'
    mailer.methods.sendVerification(user.email, user, ctx)

    ctx.body = {
      success: true,
      message: 'Successfully created account'
    }
  }
})

auth.route({
  method: 'post',
  path: '/login',
  validate: {
    type: 'form',
    body: {
      email: Joi.string().trim().email(),
      password: Joi.string().min(8).regex(/(.*[a-z].*)/).regex(/(.*[A-Z].*)/).regex(/(.*\d.*)/)
    }
  },
  handler: async ctx => {
    if (!await errorHelper.verifyRoute(ctx)) return;

    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) return;

    if (!user.comparePassword(user.password)) return;

    let token;

    do {
      token = crypto.randomBytes(64).toString('hex');
    }
    while(await User.findOne({ sessionToken: token }))
    
    user.token = token;
    user.save();

    ctx.cookies.set('token', token, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 60 })
  }
})

auth.get('/login', async ctx => {
  ctx.body = {
    success: true,
    message: 'Successfully created account'
  }
})

auth.get('/resetPassword', async ctx => {
  ctx.body = "Yo";
})

auth.get('/changePassword', async ctx => {
  ctx.body = "Yo";
})

module.exports = auth;

// postedBy: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
// title: Joi.string().invalid()