const input = document.querySelector('.input')
const submit = document.querySelector('.submit')
const chatList = document.querySelector('.chat-list')


var io = window.io('localhost:7070')

const sendMessage = () => {
  const text = input.value
  io.emit('chat', text)
  input.value = ''
}

const appendMessage = (msg) => {
  if (!msg) {
    return
  }
  const li = document.createElement('li')
  li.innerText = `${msg}`
  chatList.appendChild(li)
  chatList.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

io.on('connect', () => {
  console.log('connected')
  submit.addEventListener('click', sendMessage)
})

io.on('chat', (msg) => {
  appendMessage(msg)
})

io.on('disconnect', () => {
  console.log('disconnected')
  submit.removeEventListener('click', sendMessage)
})
