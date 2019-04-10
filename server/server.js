'use strict';

const logger = require('Logger');
const chalk = require('chalk');
const config = require('Config');

module.exports = function(app) {
  let http, https;
  if (!config.env.isDevelopment()) {
    https = generateHTTPSServer(app);
  }

  if (config.env.isDevelopment()) http = generateHTTPServer(app);
  else http = generateHTTPRedirect();

  return { http, https };
};

function generateHTTPSServer(app) {
  const greenlock = require('greenlock-koa').create({
    version: 'draft-11',
    server: config.env.isDevelopment()
      ? 'https://acme-staging-v02.api.letsencrypt.org/directory'
      : 'https://acme-v02.api.letsencrypt.org/directory',
    email: 'saghendev@gmail.com',
    agreeTos: true,
    approveDomains: ['saghen.com'],
    configDir: require('os').homedir() + '/acme/etc'
  });

  // https server
  const https = require('http2')
    .createSecureServer(greenlock.tlsOptions, greenlock.middleware(app.callback()))
    .listen(config.ports.https, function() {
      logger.info(
        chalk.blue.bold(
          `Listening at https://${config.app.domain}:${config.ports.https} via https`
        )
      );
    });

  return https;
}

function generateHTTPServer(app) {
  const http = require('http')
    .createServer(app.callback())
    .listen(config.ports.http, () => {
      logger.info(
        chalk.blue.bold(
          `Listening at http://${config.app.domain}:${config.ports.http} via http`
        )
      );
    });

  return http;
}

function generateHTTPRedirect() {
  const redir = require('redirect-https');
  const http = require('http')
    .createServer(redir())
    .listen(config.ports.http, () => {
      logger.info(
        chalk.blue.bold(
          `Listening at ${config.app.domain}:${config.ports.http} via http`
        )
      );
    });

  return http;
}