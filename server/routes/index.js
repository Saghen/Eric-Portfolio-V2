module.exports = function(Koa) {
  Koa.use(require('./api/blog').middleware());
  Koa.use(require('./api/auth').middleware());
}
