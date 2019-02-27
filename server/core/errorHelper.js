const statusCodes = require('http').STATUS_CODES
const snakeCase = require('snake-case')

module.exports = {
  build: function({ status, description, keys, source = 'payload' }) {
    return {
      error: snakeCase(statusCodes[status]),
      validation: {
        source,
        keys
      },
      status: status
    }
  },
  verifyRoute: async function(ctx) {
    const invalid = ctx.invalid

    if (typeof invalid !== 'object') return true

    const error =
      invalid.header ||
      invalid.query ||
      invalid.params ||
      invalid.body ||
      invalid.type

    if (error === undefined) return true

    ctx.body = {
      ok: false,
      name: error.name,
      status: error.status,
      errors: error.details
    }

    return false
  }
}
