'use strict'

let logger = require('Core/logger')
let config = require('Config')
let C = require('Core/constants')
let fs = require('fs')
let path = require('path')

let nodemailer = require('nodemailer')

String.prototype.replaceAll = function(search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

module.exports = {
  settings: {
    name: 'mailer',
    internal: true
  },

  methods: {
    send(recipients, subject, body) {
      return new Promise((resolve, reject) => {
        logger.info(`Sending email to ${recipients} with subject ${subject}...`)

        // recipients can be a comma separated string or array which will be sent by the 'to' field
        // recipients can also be an object with to, cc, bcc properties etc. See: 'Common fields' https://community.nodemailer.com/
        let emailRecipients = {}
        if (recipients instanceof Object) {
          if (recipients instanceof Array) emailRecipients.to = recipients
          else emailRecipients = recipients
        } else emailRecipients.to = recipients

        let mailOptions = {
          from: config.mailer.auth.user,
          to: emailRecipients.to,
          cc: emailRecipients.cc,
          bcc: emailRecipients.bcc,
          subject: subject,
          html: body
        }

        let transporter = nodemailer.createTransport(config.mailer)

        if (transporter) {
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              logger.warn('Unable to send email: ', err)
              reject(err)
            } else {
              logger.info('Email message sent.', info.response)
              resolve(info)
            }
          })
        } else
          reject(
            new Error(
              'Unable to send email! Invalid mailer transport: ' +
                config.mailer.transport
            )
          )
      })
    },
    async sendVerification(recipients, user, ctx) {
      let data = await fs.promises.readFile(
        path.resolve(__dirname, './mail/verification.html'),
        'utf8'
      )
      data = data.replaceAll(
        /{{link}}/g,
        `https://${ctx.hostname}/api/auth/verify?token=${
          user.verifyToken
        }&email=${user.email}`
      )
      await this.send(recipients, 'Sea of Electrons - Verify Your Email', data)
    }
  },

  init(ctx) {
    // Fired when start the service
  }
}
