const router = require('koa-joi-router');
const Joi = router.Joi;

const auth = router();

auth.prefix('/api/auth')

auth.route({
  method: 'post',
  path: '/login',
  validate: {

  },
  handler: async ctx => {
    await checkAuth(ctx);
  }
})

auth.get('/login', async ctx => {
  ctx.body = "Yo";
})

auth.get('/signup', async ctx => {
  ctx.body = "Yo";
})

auth.get('/resetPassword', async ctx => {
  ctx.body = "Yo";
})

auth.get('/changePassword', async ctx => {
  ctx.body = "Yo";
})

module.exports = auth;
