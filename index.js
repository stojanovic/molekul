'use strict'

const Hapi = require('hapi')

let server = new Hapi.Server()
server.connection({ port: process.env.PORT || 3000 })

server.route({
  method:  'GET',
  path:    '/',
  handler(req, reply) {
    reply('Molekul Slack bot')
  }
})

server.start(() => console.log(`Server running at: ${server.info.uri}`))
