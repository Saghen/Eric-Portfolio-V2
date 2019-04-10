'use strict'

const config = require('Config');

const koaJwt = require('koa-jwt');

module.exports = {
  jwtMiddleware() {
    return koaJwt({ secret: config.jwt.secret, cookie: config.jwt.cookie, key: 'user' })
  }
};
