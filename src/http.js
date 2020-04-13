const express = require('express');
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cookieParser = require('cookie-parser')
const usersRouter = require('./routes/users')
const partiesRouter = require('./routes/parties')
const playersRouter = require('./routes/players')
const eventsRouter = require('./routes/events')
const rolesRouter = require('./routes/roles')
const { Party } = require('./models/party')

require('./db/mongoose')

// Test
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Middlewares:
app.use(express.json())
app.use(cookieParser())
app.use('/api/users', usersRouter)
app.use('/api/parties', partiesRouter)
app.use('/api/players', playersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/roles', rolesRouter)

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('join', (partyId) => {
    console.log('Joining room ' + partyId)
    socket.join(partyId)
    // Handle chat messages:
    socket.on('message', (messageObject) => {
      io.to(partyId).emit('message', messageObject)
      // Save message to party/messages arr
      Party.findByIdAndUpdate(partyId, {
        $addToSet: {chat: {...messageObject}}
      }, (err, res) => {
        if (err) {
          console.log(err)
        }
      })
    })
    socket.on('err', (id) => {
      console.log('Leaving room ' + id)
      socket.leave(id)
    })
  })
})

module.exports = {
  http,
  io
}