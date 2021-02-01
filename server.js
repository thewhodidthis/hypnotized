'use strict'

const { existsSync, readFileSync } = require('fs')
const https = require('https')
const { Server } = require('ws')

const { cert, key } = require('./config.json')

const port = process.env.PORT || process.env.npm_package_config_port || 8014
const options = { path: '/io' }

if (existsSync(cert) && existsSync(key)) {
  options.server = https
    .createServer({ cert: readFileSync(cert), key: readFileSync(key) })
    .listen(port)
} else {
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
