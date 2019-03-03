const router = require('koa-joi-router');
const Joi = router.Joi;

const C = require('Constants');
const Post = require('Models/post');

const reqHelper = require('Helpers/reqHelper');
const HttpStatus = require('http-status-codes');
const RateLimit = require('koa2-ratelimit').RateLimit;

const blog = router();

blog.prefix('/api/blog');

blog.get('/', ctx => {
  ctx.body = 'Yo';
});

blog.route({
  method: 'post',
  path: '/insert',
  // prettier-ignore
  validate: {
    type: 'form',
    body: {
      title: Joi.string().trim().min(1).max(120).required(),
      description: Joi.string().trim().min(1).max(400).required(),
      image: Joi.string().required(),
      content: Joi.string().min(8).required(),
      topic: Joi.string().trim().only(...C.topics),
      date: Joi.date()
    },
    continueOnError: true
  },
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    let post = new Post(ctx.request.body);

    if (await Post.findOne({ title: post.title })) {
      ctx.status = HttpStatus.CONFLICT;
      ctx.body = reqHelper.buildError({
        errors: [
          { key: 'title', message: 'A post with that title already exists' }
        ],
        status: HttpStatus.CONFLICT
      });
      return;
    }

    try {
      await post.save();
    } catch (err) {
      console.error(err.message);
    }

    ctx.body = reqHelper.build({ message: 'Successfully created blog post' });
  }
});

blog.route({
  method: 'get',
  path: '/list',
  validate: {
    query: {
      maxitems: Joi.number().default(20),
      count: Joi.number().default(0)
    },
    continueOnError: true
  },
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    let posts;

    try {
      posts = await Post.find({ hidden: false })
        .skip(ctx.query.count)
        .limit(ctx.query.maxItems);
    } catch (err) {
      console.error(err);
    }

    ctx.body = reqHelper.build({ data: posts });
  }
});

blog.route({
  method: 'get',
  path: '/get',
  validate: {
    query: Joi.object()
      .keys({
        id: Joi.number().min(1),
        title: Joi.string().min(1)
      })
      .xor('id', 'title'),
    continueOnError: true
  },
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    let post;

    try {
      if (ctx.query.id)
        post = await Post.findOne({ _id: ctx.query.id, hidden: false });
      else if (ctx.query.title)
        post = await Post.findOne({
          title: ctx.query.title,
          hidden: false
        }).collation({ locale: 'en', strength: 2 }); // Makes the query case insensitive
    } catch (err) {
      console.error(err);
    }

    if (post === undefined || post === null) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = reqHelper.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          { key: 'index', message: 'The request blog post was not found' }
        ]
      });
      return;
    }

    ctx.body = reqHelper.build({ data: post });
  }
});

module.exports = blog;
