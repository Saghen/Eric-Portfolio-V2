require('module-alias/register')
require('dotenv').config();

const Koa = require('koa')
const app = new Koa()

const logger = require('Logger')
const chalk = require('chalk')
const config = require('Config')

require('Routes')(app)

const greenlock = require('greenlock').create({
  version: 'draft-11',
  server: 'https://acme-staging-v02.api.letsencrypt.org/directory',
  email: config.app.contactEmail,
  agreeTos: true,
  approveDomains: [config.app.domain],
  configDir: require('os').homedir() + '/acme/etc'
  //, debug: true
})

// https server
const https = require('https')
const server = https.createServer(
  greenlock.tlsOptions,
  greenlock.middleware(app.callback())
)

server.listen(443, function() {
  logger.info(
    chalk.blue.bold(`Listening at https://saghen.com:${this.address().port}`)
  )
})

// http redirect to https
const redir = require('redirect-https')()
const http = require('http')
http.createServer(greenlock.middleware(redir)).listen(80, () => {
  logger.info(
    chalk.blue.bold(
      'Listening on port 80 to handle ACME http-01 challenge and redirect to https'
    )
  )
})
