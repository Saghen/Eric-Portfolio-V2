const router = require('koa-joi-router');
const Joi = router.Joi;

const blog = router();

blog.prefix('/blog')

blog.get('/', ctx => {
  ctx.body = "Yo";
})

module.exports = blog;
