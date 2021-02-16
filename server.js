'use strict'

const { readFileSync } = require('fs')
const https = require('https')

const { cert, key } = require('./config.json')

const port = process.env.PORT || process.env.npm_package_config_port || 8014
const connections = new Map()

const max = process.env.MAX || 1000
const history = []

const server = https.createServer({
  cert: readFileSync(cert),
  key: readFileSync(key)
})

let index = -1

server
  .on('request', (request, response) => {
    const { headers, socket, url } = request
    const { accept, origin = '' } = headers

    if (accept === 'text/event-stream' && url === '/io') {
      // Because http static serving is separately hosted
      if (/(localhost|thewhodidthis)/.test(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin)
      }

      // Set up connection
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream'
      })

      // Give out past durations
      response.write(`data: ${JSON.stringify(history)}\n\n`)

      // Keep track of open links
      connections.set(socket, response)

      // Start timing
      const startTime = Date.now()

      // Handle disconnect
      request.on('close', () => {
        // Drop connection from client list
        connections.delete(socket)

        // Stop timing
        const endTime = Date.now()

        // Save in history
        history.splice(index, 1, endTime - startTime)

        // Tell any others
        connections.forEach((r) => {
          r.write(`data: ${JSON.stringify(history)}\n\n`)
        })
      })

      // Update current history index within bounds
      index += 1
      index %= max
    }
  })
  .listen(port)
