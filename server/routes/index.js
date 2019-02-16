module.exports = function(Koa) {
  Koa.use(require('./api/blog').middleware());
}
