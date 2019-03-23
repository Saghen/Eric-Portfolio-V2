require('module-alias/register');
require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const send = require('koa-send');

const logger = require('Logger');
const chalk = require('chalk');
const config = require('Config');

const path = require('path');

app.use(require('koa-compress')());

if (config.mode == 'development') 
  app.use(require('@koa/cors')());

app.use(
  require('koa-static')(path.join(__dirname, '../client/dist/'), {
    maxage: 1000 * 60 * 5 // 5 minutes
  })
);
require('Routes')(app);

// 404
app.use(async (ctx) => {
  await send(ctx, 'index.html', { root: path.join(__dirname, '../client/dist/') });
})


const greenlock = require('greenlock').create({
  version: 'draft-11',
  server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
  email: config.app.contactEmail,
  agreeTos: true,
  approveDomains: [config.app.domain],
  configDir: path.join(require('os').homedir(), 'acme/etc')
  //, debug: true
});

const { staticServe } = require('fastify-auto-push');

const https = require('spdy');

greenlock
  .register({
    domains: [config.app.domain],
    email: config.app.contactEmail,
    agreeTos: true,
    communityMember: true
  })
  .then(certs => {
    const server = https.createServer(
      {
        key: certs.privkey,
        cert: certs.cert + '\r\n' + certs.chain
      },
      app.callback()
    );

    server.listen(config.ports.https);

    logger.info(
      chalk.blue.bold(`Listening at https://saghen.com:${config.ports.https}`)
    );
  });


// http redirect to https
const redir = require('redirect-https')();
const http = require('http');
http.createServer(greenlock.middleware(redir)).listen(config.ports.http, () => {
  logger.info(
    chalk.blue.bold(
      `Listening on port ${
        config.ports.http
      } to handle ACME http-01 challenge and redirect to https`
    )
  );
});
