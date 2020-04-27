'use strict'

const { Server: WebSocketServer } = require('ws')

const io = new WebSocketServer({
  port: process.env.PORT || process.env.npm_package_config_port || 8014,
  path: '/io'
})

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
