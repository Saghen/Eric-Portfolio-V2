module.exports = async function(Koa) {
  const db = require('Core/mongo')();

  Koa.use(require('./api/blog').middleware());
  Koa.use(require('./api/auth').middleware());
}
