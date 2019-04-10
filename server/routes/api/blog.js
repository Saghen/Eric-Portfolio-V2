'use strict';

const config = require('Config/');

const Router = require('koa-joi-router');
const Joi = Router.Joi;

const C = require('Constants');
const Post = require('Models/post');
const User = require('Models/user');

const reqHelper = require('Helpers/reqHelper');
const auth = require('Helpers/auth');

const HttpStatus = require('http-status-codes');

const koaJwt = require('koa-jwt');

const blog = Router({
  errorHandler: reqHelper.routerErrorHandler
});

const mongoose = require('mongoose');

blog.prefix('/blog');

//#region Insert Post

blog.route({
  method: 'put',
  path: '/insert',
  // prettier-ignore
  validate: {
    type: 'json',
    body: {
      title: Joi.string().trim().min(1).max(120).required(),
      description: Joi.string().trim().min(1).max(400).required(),
      image: Joi.string().required(),
      content: Joi.string().min(8).required(),
      topic: Joi.string().trim().only(...C.topics),
      date: Joi.date(),
      draft: Joi.boolean(),
      hidden: Joi.boolean()
    },
    maxBody: Number.POSITIVE_INFINITY
  },
  pre: auth.jwtMiddleware(),
  handler: async ctx => {
    let user = await User.findOne({ email: ctx.state.user.email });

    if (!user) ctx.buildErr({
      status: HttpStatus.NOT_FOUND,
      errors: [{
        key: 'token',
        message: 'The logged in user was not found in the database'
      }]
    })

    ctx.request.body.postedBy = user._id;

    let post = new Post(ctx.request.body);

    if (await findOnePost({ title: post.title })) {
      return ctx.buildError({
        errors: [
          { key: 'title', message: 'A post with that title already exists' }
        ],
        status: HttpStatus.CONFLICT
      });
    }

    try {
      await post.save();
    } catch (err) {
      logger.error(err.message);
      throw Error('An error occured while saving a new post while inserting');
    }

    ctx.build({ message: 'Successfully created blog post' });
  }
});
//#endregion
//#region Update post
blog.route({
  method: 'patch',
  path: '/update',
  // prettier-ignore
  validate: {
    type: 'form',
    body: {
      id: Joi.number().min(1).required(),
      title: Joi.string().trim().min(1).max(120),
      description: Joi.string().trim().min(1).max(400),
      image: Joi.string(),
      content: Joi.string().min(8),
      topic: Joi.string().trim().only(...C.topics),
      date: Joi.date(),
      postedBy: Joi.string().regex(/^[a-f\d]{24}$/i)
    }
  },
  pre: auth.jwtMiddleware(),
  handler: async ctx => {
    const body = ctx.request.body;
    if (body.postedBy) body.postedBy = mongoose.Types.ObjectId(body.postedBy);

    if (await findOnePost({ id: body.id })) {
      return ctx.buildError({
        errors: [
          { key: 'title', message: 'A post with that title already exists' }
        ],
        status: HttpStatus.CONFLICT
      });
    }

    existingPost.update(body.postedBy);

    try {
      await post.save();
    } catch (err) {
      logger.error(err.message);
      ctx.throw(500);
    }

    ctx.build({ message: 'Successfully created blog post' });
  }
});
//#endregion
//#region List posts

blog.route({
  method: 'get',
  path: '/list',
  validate: {
    query: {
      maxitems: Joi.number().default(20),
      page: Joi.number().default(1)
    }
  },
  handler: async ctx => {
    let posts = await findPosts(ctx.query);

    ctx.build({ data: posts });
  }
});

//#endregion
//#region Get Post

blog.route({
  method: 'get',
  path: '/get',
  validate: {
    query: Joi.object()
      .keys({
        id: Joi.number().min(1),
        title: Joi.string().min(1)
      })
      .xor('id', 'title')
  },
  handler: async ctx => {
    let post = await findOnePost(ctx.query);

    if (post === undefined || post === null) {
      return ctx.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            key: ctx.query.id ? 'id' : 'title',
            message: 'The request blog post was not found'
          }
        ]
      });
    }

    post.views++;

    ctx.build({ data: post });

    post.save();
  }
});

//#endregion
//#region Delete Post

blog.route({
  method: 'delete',
  path: '/delete',
  validate: {
    query: Joi.object()
      .keys({
        id: Joi.number().min(1),
        title: Joi.string().min(1)
      })
      .xor('id', 'title')
  },
  handler: async ctx => {
    let post = await findOnePost(ctx.query);

    if (post === undefined || post === null) {
      return ctx.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          { key: 'index', message: 'The request blog post was not found' }
        ]
      });
    }

    post.remove();
  }
});

//#endregion

//#region Database Helpers
const postedByProperties = [
  'fullname',
  'lastName',
  'firstName',
  'roles',
  'profileImage'
]

async function findOnePost({ id, title }) {
  let post;

  if (id)
    post = await Post.findOne({
      _id: id,
      hidden: false
    }).populate('postedBy', postedByProperties);
  else if (title)
    post = await Post.findOne({
      title: title,
      hidden: false
    })
      .collation({ locale: 'en', strength: 2 }) // Makes the query case insensitive
      .populate('postedBy', postedByProperties);

  return post;
}

async function findPosts({ maxitems, page }) {
  return await Post.find({ hidden: false })
    .sort({ _id: -1 })
    .skip((page - 1) * maxitems)
    .limit(maxitems)
    .populate('postedBy', postedByProperties);
}
//#endregion

//#region Other Data
blog.route({
  method: 'get',
  path: '/topics',
  handler: async ctx => {
    ctx.body = C.topics;
  }
});
//#endregion

module.exports = blog;
