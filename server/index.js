require('module-alias/register');
require('dotenv').config();

const logger = require('Logger');
const chalk = require('chalk');

const app = require('./koa')();

const { http, https } = require('./server')(app);


