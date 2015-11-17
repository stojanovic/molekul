'use strict'

const Hapi   = require('hapi'),
      qs     = require('qs'),
      rp     = require('request-promise'),
      config = require('./config/config.json')

let server = new Hapi.Server()
server.connection({ port: process.env.PORT || 4747 })

// console.log(config.slack)

server.route({
  method:  'GET',
  path:    '/',
  handler(req, reply) {
    reply('Molekul Slack bot')
  }
})

server.route({
  method:  'GET',
  path:    '/connect',
  handler(req, reply) {
    let query = {
      client_id:    config.slack.appClientId,
      scope:        'team:read channels:read chat:write:bot',
      redirect_uri: config.slack.redirectUri
    }
    let authUrl = `https://slack.com/oauth/authorize?${qs.stringify(query)}`

    reply('Redirecting to Slack').redirect(authUrl)
  }
})

server.route({
  method: 'GET',
  path:   '/connectRedirect',
  handler(req, reply) {
    if (req.query.code) {
      let params = {
        client_id:     config.slack.appClientId,
        client_secret: config.slack.appSecret,
        code:          req.query.code,
        redirect_uri:  config.slack.redirectUri
      }
      let oauthUrl = `https://slack.com/api/oauth.access?${qs.stringify(params)}`

      rp(oauthUrl)
        .then(response => reply(response))
    } else {
      reply('Code is required')
    }
  }
})

server.start(() => console.log(`Server running at: ${server.info.uri}`))
