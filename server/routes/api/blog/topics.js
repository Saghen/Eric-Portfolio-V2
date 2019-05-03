const config = require('Config/');

const Router = require('koa-joi-router');
const Joi = Router.Joi;

const C = require('Constants');
const mongoose = require('mongoose');
const Topic = require('Models/topic');

const reqHelper = require('Helpers/reqHelper');
const auth = require('Helpers/auth');

const HttpStatus = require('http-status-codes');
const router = Router({
  errorHandler: reqHelper.routerErrorHandler
});

router.prefix('/topics');

router.route({
  method: 'get',
  path: '/get',
  // prettier-ignore
  validate: {
    query: Joi.object().keys({
      id: Joi.string().regex(/^[a-f\d]{24}$/i),
      topic: Joi.string().min(1).trim()
    }).xor('id', 'topic')
  },
  preHandle: [
    getTopicMiddleware({ id: true, topic: true, query: true }),
    verifyTopicMiddleware()
  ],
  async handler(ctx) {
    const query = ctx.request.query;
    cleanObj(query);

    const topic = await findOneTopic(query);

    if (!topic) {
      return ctx.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            key: 'id',
            message: 'A blog topic with that id does not exist'
          }
        ]
      });
    }

    ctx.build({
      data: topic
    });
  }
});

router.route({
  method: 'get',
  path: '/list',
  handler: async ctx => {
    ctx.build({
      data: await findTopics()
    });
  }
});

router.route({
  method: 'patch',
  path: '/update',
  // prettier-ignore
  validate: {
    type: ['json', 'form'],
    body: {
      id: Joi.string().regex(/^[a-f\d]{24}$/i).required(),
      topic: Joi.string().min(1).trim().required()
    }
  },
  pre: auth.jwtMiddleware(),
  preHandle: [getTopicMiddleware({ id: true }), verifyTopicMiddleware()],
  handler: async ctx => {
    const query = ctx.request.body;

    await Topic.updateOne({ _id: query.id }, { topic: query.topic });

    ctx.build({ message: 'Successfully updated blog topic' });
  }
});

router.route({
  method: 'delete',
  path: '/delete',
  // prettier-ignore
  validate: {
    query: {
      id: Joi.string().regex(/^[a-f\d]{24}$/i).required()
    }
  },
  pre: auth.jwtMiddleware(),
  preHandle: [getTopicMiddleware({ id: true, query: true }), verifyTopicMiddleware()],
  handler: async ctx => {
    await ctx.topic.remove();
    ctx.build({ message: 'Successfully removed topic' });
  }
});

router.route({
  method: 'put',
  path: '/insert',
  // prettier-ignore
  validate: {
    type: ['json', 'form'],
    body: {
      topic: Joi.string().min(1).trim().required()
    }
  },
  pre: auth.jwtMiddleware(),
  preHandle: [getTopicMiddleware({ topic: true })],
  handler: async ctx => {
    if (ctx.topic) {
      return ctx.buildError({
        status: HttpStatus.CONFLICT,
        errors: [
          {
            key: 'topic',
            message: 'The provided topic already exists'
          }
        ]
      });
    }
    const topic = new Topic({ topic: ctx.request.body.topic });

    await topic.save();

    ctx.build({ message: 'Successfully inserted topic' });
  }
});

function getTopicMiddleware(opts = { id, topic, query }) {
  return async function(ctx, next) {
    const data = opts.query ? ctx.request.query : ctx.request.body;
    const query = {};

    if (opts.id) {
      query.id = data.id;
    }
    if (opts.topic) {
      query.topic = data.topic;
    }

    if (!opts.id && !opts.topic) {
      return new Error('The id or topic must be true');
    }

    const topic = await findOneTopic(query);

    ctx.topic = topic;
    await next();
  };
}

function verifyTopicMiddleware() {
  return async function(ctx, next) {
    if (!ctx.topic) {
      return ctx.buildError({
        status: HttpStatus.NOT_FOUND,
        errors: [
          {
            key: 'id',
            message: 'A blog topic with that id does not exist'
          }
        ]
      });
    }

    await next();
  };
}

async function findTopics() {
  return await Topic.find();
}

async function findOneTopic(opts = { id, topic }) {
  cleanObj(opts);

  if (opts.id) {
    opts._id = mongoose.Types.ObjectId(opts.id);
    delete opts.id;
  }

  return await Topic.findOne(opts);
}

function cleanObj(obj) {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
}

module.exports = router;
