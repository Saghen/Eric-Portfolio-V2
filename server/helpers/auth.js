'use strict';

const config = require('Config');

const koaJwt = require('koa-jwt');

module.exports = {
  jwtMiddleware() {
    if (config.jwt.disable)
      return async (ctx, next) => {
        ctx.state.user = { email: 'saghendev@gmail.com' }; // Necessary to fake having a login
        await next();
      };
    return koaJwt({
      secret: config.jwt.secret,
      cookie: config.jwt.cookie,
      key: 'user'
    });
  },
  jwtMiddlewareContinue() {
    if (config.jwt.disable)
      return async (ctx, next) => {
        ctx.state.user = { email: 'saghendev@gmail.com' }; // Necessary to fake having a login
        await next();
      };
    return koaJwt({
      secret: config.jwt.secret,
      cookie: config.jwt.cookie,
      key: 'user',
      passthrough: true
    });
  }
};
