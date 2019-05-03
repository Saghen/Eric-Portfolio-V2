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
const posts = Router({
  errorHandler: reqHelper.routerErrorHandler
});

const mongoose = require('mongoose');

//#region Insert Post

posts.route({
  method: 'put',
  path: '/insert',
  // prettier-ignore
  validate: {
    type: 'json',
    body: {
      title: Joi.string().trim().min(1).max(240).required(),
      description: Joi.string().trim().min(1).max(800).required(),
      image: Joi.string().required(),
      content: Joi.string().min(8).required(),
      topic: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
      date: Joi.date().default(new Date()),
      draft: Joi.boolean()
    },
    maxBody: Number.POSITIVE_INFINITY
  },
  pre: auth.jwtMiddleware(),
  handler: async ctx => {
    let user = await User.findOne({ email: ctx.state.user.email });

    if (!user)
      ctx.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            key: 'token',
            message: 'The logged in user was not found in the database'
          }
        ]
      });

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

posts.route({
  method: 'patch',
  path: '/update',
  // prettier-ignore
  validate: {
    type: ['json', 'form'],
    body: {
      id: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
      title: Joi.string().trim().min(1).max(120),
      description: Joi.string().trim().min(1).max(400),
      image: Joi.string(),
      content: Joi.string().min(8),
      topic: Joi.string().regex(/^[a-f\d]{24}$/i),
      date: Joi.date(),
      draft: Joi.boolean(),
      postedBy: Joi.string().regex(/^[a-f\d]{24}$/i)
    }
  },
  pre: auth.jwtMiddleware(),
  handler: async ctx => {
    const body = ctx.request.body;
    if (body.postedBy) body.postedBy = mongoose.Types.ObjectId(body.postedBy);

    let changes = {
      ...body
    };

    delete changes.id;

    let existingPost = await findOnePostAny({ id: body.id });

    if (!existingPost) {
      return ctx.buildError({
        errors: [{ key: 'id', message: 'A post with that id does not exist' }],
        status: HttpStatus.NOT_FOUND
      });
    }

    if (existingPost.draft == true && body.draft == false) {
      body.date = new Date();
    }

    try {
      await Post.updateOne({ _id: body.id }, body);
    } catch (err) {
      logger.error(err.message);
      ctx.throw(500);
    }

    ctx.build({ message: 'Successfully updated blog post' });
  }
});
//#endregion
//#region List posts

posts.route({
  method: 'get',
  path: '/list',
  validate: {
    query: {
      maxitems: Joi.number().default(20),
      page: Joi.number().default(1),
      draft: Joi.boolean().default(false)
    }
  },
  pre: auth.jwtMiddlewareContinue(),
  handler: async ctx => {
    let query = ctx.query;

    let posts;

    if (query.draft) {
      if (!ctx.state.user)
        return ctx.buildError({
          status: HttpStatus.FORBIDDEN,
          errors: [
            {
              key: 'token',
              message: 'You are not logged in'
            }
          ]
        });
    }

    posts = await findPosts(query);

    let count = await countPosts(query);

    ctx.build({
      data: {
        posts,
        count
      }
    });
  }
});

//#endregion
//#region Get Post

posts.route({
  method: 'get',
  path: '/get',
  validate: {
    query: Joi.object()
      .keys({
        id: Joi.string().regex(/^[a-f\d]{24}$/i),
        title: Joi.string().min(1),
        draft: Joi.boolean().default(false)
      })
      .xor('id', 'title')
  },
  pre: auth.jwtMiddlewareContinue(),
  handler: async ctx => {
    
    let query = {
      id: ctx.query.id,
      title: ctx.query.title
    };

    let post;

    console.time('yuh')

    if (ctx.state.user) post = await findOnePostAny(query);
    else post = await findOnePost(query);

    console.timeEnd('yuh')

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

    ctx.build({ data: post });
  }
});

//#endregion
//#region Delete Post

posts.route({
  method: 'delete',
  path: '/delete',
  validate: {
    query: Joi.object()
      .keys({
        id: Joi.string().regex(/^[a-f\d]{24}$/i),
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
];

async function findOnePost({ id, title, draft = false }) {
  let post;

  if (id)
    post = await Post.findOne({
      _id: id,
      draft
    })
      .populate('postedBy', postedByProperties)
      .populate('topic');
  else if (title)
    post = await Post.findOne({
      title: title,
      draft
    })
      .collation({ locale: 'en', strength: 2 }) // Makes the query case insensitive
      .populate('postedBy', postedByProperties)
      .populate('topic');

  return post;
}

async function findOnePostAny({ id, title }) {
  let post;

  if (id)
    post = await Post.findOne({
      _id: id
    })
      .collation({ locale: 'en', strength: 2 }) // Makes the query case insensitive
      .populate('postedBy', postedByProperties)
      .populate('topic');
  else if (title)
    post = await Post.findOne({
      title: title
    })
      .collation({ locale: 'en', strength: 2 }) // Makes the query case insensitive
      .populate('postedBy', postedByProperties)
      .populate('topic');

  return post;
}

async function findPosts({ maxitems = 20, page = 20, draft = false }) {
  return await Post.find({ draft })
    .sort({ _id: -1 })
    .skip((page - 1) * maxitems)
    .limit(maxitems)
    .populate('postedBy', postedByProperties)
    .populate('topic');
}

async function countPosts({ draft = false }) {
  return await Post.count({ draft });
}
//#endregion

module.exports = posts;
