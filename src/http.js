const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const usersRouter = require('./routes/users')
const partiesRouter = require('./routes/parties')
const playersRouter = require('./routes/players')
const eventsRouter = require('./routes/events')
const rolesRouter = require('./routes/roles')

require('./db/mongoose')

// Test
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Middlewares:
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/parties', partiesRouter)
app.use('/api/players', playersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/roles', rolesRouter)


io.on('connection', (socket) => {
  console.log('a user connected');
});

module.exports = http