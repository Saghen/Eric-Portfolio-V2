const statusCodes = require('http').STATUS_CODES;
const snakeCase = require('snake-case');

module.exports = {
  build: function({ status = 200, errors, ok, data }) {
    return {
      ok,
      name: statusCodes[status],
      status,
      errors,
      data
    };
  },
  verifyRoute: async function(ctx) {
    const invalid = ctx.invalid;

    if (typeof invalid !== 'object') return true;

    const error =
      invalid.header ||
      invalid.query ||
      invalid.params ||
      invalid.body ||
      invalid.type;

    if (error === undefined) return true;

    if (error.details instanceof Array)
      error.details = error.details.map(err => {
        return {
          message: err.message,
          key: err.path[0]
        };
      });

    ctx.body = {
      ok: false,
      name: error.name,
      status: error.status,
      errors: error.details
    };

    return false;
  }
};
