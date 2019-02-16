'use strict'

let path = require('path');

global.rootPath = path.join(__dirname, '../');

module.exports = {
  app: {
    url: 'https://saghen.com/',
    domain: 'saghen.com',
    contactEmail: 'liamcdyer@gmail.com'
  },

  ip: process.env.NODE_IP || '0.0.0.0',
  ports: {
    http: process.env.HTTP_PORT || 80,
    https: process.env.HTTPS_PORT || 443,
  },

  rootPath: global.rootPath,

  uploadLimit: process.env.UPLOAD_LIMIT || 15 * 1024 * 1024, // 15MB

  sessions: {
    cookie: {
      maxAge: 14 * 24 * (60 * 60 * 1000), // 2 weeks
      httpOnly: true,
      secure: true
    },
    secret: process.env.SESSION_SECRET || 'secretdoggo'
  },

  test: false,

  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/ericPortfolio',
    options: {
      user: process.env.MONGO_USERNAME || '',
      pass: process.env.MONGO_PASSWORD || '',
      useNewUrlParser: true
    }
  },

  cacheTimeout: 5 * 60, // 5 mins

  mailer: {
    host: process.env.MAILER_HOST || 'smtp.gmail.com',
    post: process.env.MAILER_POST || 465,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD
    }
  },

  logging: {
    console: {
      level: process.env.LOGGING_LEVEL || 'debug'
    },

    file: {
      enabled: true,
      path: path.join(global.rootPath, 'logs'),
      level: 'info',
      json: false,
      exceptionFile: true
    }
  }
};