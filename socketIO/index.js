/*
socketio服务器端
 */
const {ChatModel} = require('../db/models')
module.exports = function (server) {
  // 得到IO对象
  const io = require('socket.io')(server)
  // 监视浏览器与服务器的连接
  io.on('connection', function (socket) { // socket代表服务器与某个浏览器的连接对象
    console.log('浏览器连接上了')
    // 绑定接收消息的监听(sendMsg)
    socket.on('sendMsg', function ({content, from, to}) {
      console.log('sendMsg', {content, from, to})
      // 1. 保存到数据库集合(chats)
      const chat_id = [from, to].sort().join('_')
      const create_time = Date.now()
      new ChatModel({content, from, to, chat_id, create_time}).save(function (error, chatMsg) {
        // 2. 全局发送消息给所有连接的浏览器(receiveMsg: chatMsg)
        io.emit('receiveMsg', chatMsg)
        console.log('receiveMsg', chatMsg)
      })
    })
  })
}