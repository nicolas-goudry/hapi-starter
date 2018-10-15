import AWS from 'aws-sdk'

const plugin = {
  name: 'aws',
  register: function (server, options) {
    server.expose('ses', new AWS.SES(options))
  }
}

export default plugin
