const config = require('Config/');

const Router = require('koa-joi-router');
const blog = Router();

blog.prefix('/blog');

blog.use(require('./posts').middleware());
blog.use(require('./topics').middleware());

module.exports = blog;
