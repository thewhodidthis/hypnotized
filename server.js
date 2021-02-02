'use strict'

const { readFileSync } = require('fs')
const path = require('path')
const https = require('https')
const { Server } = require('ws')

const port = process.env.PORT || process.env.npm_package_config_port || 8014
const options = { path: '/io' }

try {
  const config = readFileSync(path.resolve(__dirname, './config.json'))
  const { cert, key } = JSON.parse(config)

  options.server = https
    .createServer({ cert: readFileSync(cert), key: readFileSync(key) })
    .listen(port)
} catch (_) {
  options.port = port
}

const io = new Server(options)

const bumps = []
const maxEntries = process.env.MAX || 1000

let currentHistoryIndex = -1

io.on('connection', (socket) => {
  const visitStartTime = Date.now()

  socket.send(JSON.stringify({ bumps }))
  socket
    .on('error', console.error)
    .on('close', () => {
      const visitDuration = Date.now() - visitStartTime

      bumps.splice(currentHistoryIndex, 1, visitDuration)

      io.clients.forEach((client) => {
        client.send(JSON.stringify({ bumps }))
      })
    })

  currentHistoryIndex += 1
  currentHistoryIndex %= maxEntries
})
