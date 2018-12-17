import AWS from 'aws-sdk'
import fs from 'fs'
import template from 'lodash.template'
import nodemailer from 'nodemailer'
import path from 'path'

const plugin = {
  name: 'mailer',
  register: function (server, options) {
    const transportOptions = options.smtp || {
      SES: new AWS.SES(options.ses)
    }
    const mailer = {
      transport: nodemailer.createTransport(transportOptions)
    }

    /**
     * This function sends an email with nodemailer
     * @param {Object} params Email parameters
     * @param {String} params.message HTML message with variable values
     * @param {Object} params.data Variable replacements
     * @param {String} params.to Email receiver
     * @param {String} params.subject Email subject
     * @param {String} params.template Template file name
     * @returns {Promise} Transporter sendMail promise
     */
    const send = async (params) => {
      if (!params.to || !params.subject) {
        throw Error('Missing email destination and/or subject')
      }

      const opts = params

      opts.from = options.sender

      if (opts.template) {
        const tPath = path.resolve(__dirname, '../../emails', opts.template)

        opts.html = template(fs.readFileSync(`${tPath}.html`, 'utf8'))(opts.data)
        opts.text = template(fs.readFileSync(`${tPath}.txt`, 'utf8'))(opts.data)

        if (opts.data) {
          delete opts.data
        }

        delete opts.template
      } else if (opts.message) {
        opts.text = template(opts.message)(opts.data)
        opts.html = opts.text

        delete opts.message
      } else {
        throw Error('No email content given')
      }

      return new Promise((resolve, reject) => {
        mailer.transport.sendMail(
          opts,
          (error, reply) => (error ? reject(error) : resolve(reply))
        )
      })
    }

    server.expose('send', send)
  }
}

export default plugin
