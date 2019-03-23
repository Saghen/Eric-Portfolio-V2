'use strict'

const config = require('Config/');

const router = require('koa-joi-router');
const Joi = router.Joi;

<<<<<<< HEAD
const C = require('../../core/constants');
const Post = require('../../models/post');
=======
const C = require('Constants');
const Post = require('Models/post');

const reqHelper = require('Helpers/reqHelper');
const HttpStatus = require('http-status-codes');
const RateLimit = require('koa2-ratelimit').RateLimit;

const koaJwt = require('koa-jwt');
>>>>>>> 546f1dea3dd99077863e2aa34758a5f8d18be929

const blog = router();

const mongoose = require('mongoose');

blog.prefix('/api/blog');

<<<<<<< HEAD
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
=======
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
      date: Joi.date(),
      postedBy: Joi.string().regex(/^[a-f\d]{24}$/i).required()
    },
    maxBody: Number.POSITIVE_INFINITY,
    continueOnError: true
  },
  pre: koaJwt({ secret: config.jwt.secret, cookie: 'token' }),
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    ctx.request.body.postedBy = mongoose.Types.ObjectId(
      ctx.request.body.postedBy
    );

    let post = new Post(ctx.request.body);

    if (
      await Post.findOne({ title: post.title }).collation({
        locale: 'en',
        strength: 2
      })
    ) {
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
      logger.error(err.message);
    }

    ctx.body = reqHelper.build({ message: 'Successfully created blog post' });
  }
});
>>>>>>> 546f1dea3dd99077863e2aa34758a5f8d18be929

blog.route({
  method: 'get',
  path: '/list',
  validate: {
    query: {
<<<<<<< HEAD
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
=======
      maxitems: Joi.number().default(20),
      page: Joi.number().default(1)
    },
    continueOnError: true
  },
  handler: async ctx => {
    if (!(await reqHelper.verifyRoute(ctx))) return;

    let posts = await findPosts(ctx.query);

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
    console.log(ctx.cookies.get('token'));
    if (!(await reqHelper.verifyRoute(ctx))) return;

    let post = await findOnePost(ctx.query);

    if (post === undefined || post === null) {
      ctx.status = HttpStatus.NOT_FOUND;
      ctx.body = reqHelper.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            key: ctx.query.id ? 'id' : 'title',
            message: 'The request blog post was not found'
          }
        ]
      });
      return;
    }

    post.views++;

    ctx.body = reqHelper.build({ data: post });

    post.save();
  }
});

blog.route({
  method: 'delete',
  path: '/delete',
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

    let post = await findOnePost(ctx.query);

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

    post.remove();
  }
});

async function findOnePost({ id, title }) {
  let post;

  if (id)
    post = await Post.findOne({
      _id: id,
      hidden: false
    }).populate('postedBy');
  else if (title)
    post = await Post.findOne({
      title: title,
      hidden: false
    })
      .collation({ locale: 'en', strength: 2 })
      .populate('postedBy', ['fullname', 'lastName', 'firstName', 'roles', 'profileImage']); // Makes the query case insensitive

  return post;
}

async function findPosts({ maxitems, page }) {
  return await Post.find({ hidden: false })
    .sort({ _id: -1 })
    .skip((page - 1) * maxitems)
    .limit(maxitems)
    .populate('postedBy', ['fullname', 'lastName', 'firstName', 'roles', 'profileImage']);
}
>>>>>>> 546f1dea3dd99077863e2aa34758a5f8d18be929

module.exports = blog;
