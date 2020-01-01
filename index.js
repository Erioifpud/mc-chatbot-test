const mc = require('minecraft-protocol')
const io = require('socket.io')(7070)

function parseMessage (obj) {
  const reduce = (list) => list.reduce((str, item) => { 
    return str + item.text
  }, '')

  if (obj.translate == 'chat.type.announcement' || obj.translate == 'chat.type.text') {
    return reduce(obj.with)
  }
  if (obj.extra) {
    return reduce(obj.extra)
  }
  return
}

const client = mc.createClient({
  host: "localhost",
  port: 65535,
  username: 'Bot',
  version: false
})
let isLogin = false
let clientAvaliable = false
let ioAvaliable = false
client.on('chat', function (packet) {
  if (!isLogin) {
    client.write('chat', { message: '/login pass' })
    isLogin = true
    clientAvaliable = true
  }
  
  // Listen for chat messages and echo them back.
  const jsonMsg = JSON.parse(packet.message)
  if (ioAvaliable) {
    io.emit('chat', parseMessage(jsonMsg))
  }
})

io.on('connection', (socket) => {
  ioAvaliable = true
  socket.on('chat', (msg) => {
    if (clientAvaliable) {
      // io.emit('chat', msg)
      client.write('chat', {
        message: msg
      })
    }
  })
})
