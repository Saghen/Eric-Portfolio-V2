const router = require('koa-joi-router');
const Joi = router.Joi;

const C = require('../../core/constants');
const Post = require('../../models/post');

const blog = router();

blog.prefix('/api/blog')

blog.route({
  method: 'get',
  path: '/list',
  validate: {
    query: {
      topic: Joi.string().only(...C.topics),
      page: Joi.number().default(0),
      pageCount: Joi.number().default(10)
    },
  },
  async handler(ctx) {
    let query = {
      id: { $gt: ctx.query.page * ctx.query.pageCount, $lt: ctx.query.page * ctx.query.pageCount + ctx.query.pageCount - 1 }
    }

    if (ctx.query.topic) {
      query.topic = ctx.query.topic;
    }

    let posts = await Post.find(query);

    ctx.body = posts;
  }
})

blog.route({
  method: 'get',
  path: '/list',
  validate: {
    query: {
      id: Joi.number().required()
    }
  },
  async handler(ctx) {
    let query = {
      id: ctx.query.id
    }

    let post = await Post.findOne(query);

    ctx.body = post;
  }
})

module.exports = blog;
