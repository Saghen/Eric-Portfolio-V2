const statusCodes = require('http').STATUS_CODES;
const snakeCase = require('snake-case');

module.exports = {
  build: function({ status = 200, ok = true, data, message }) {
    return {
      ok,
      name: statusCodes[status],
      status,
      data,
      message
    };
  },
  buildError: function({ status = 400, errors = [{ key, message }] }) {
    return {
      ok: false,
      name: statusCodes[status],
      status,
      errors
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

    if (invalid.type && invalid.type.message) {
      error.details = [{
          message: error.message,
          key: 'type'
        }];
    }

    ctx.body = {
      ok: false,
      name: error.name,
      status: error.status,
      errors: error.details
    };

    return false;
  }
};
