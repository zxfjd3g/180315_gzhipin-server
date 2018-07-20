module.exports = function (server) {
  // 得到IO对象
  const io = require('socket.io')(server)
  // 监视连接(当有一个客户连接上时回调)
  io.on('connection', function (socket) {//socket: 代表服务器与某个浏览器的连接
    console.log('soketio connected')
    // 绑定sendMsg监听, 接收客户端发送的消息
    socket.on('sendMsg', function (data) {
      console.log('服务器接收到浏览器的消息', data)
      // 向客户端发送消息(名称, 数据)
      io.emit('receiveMsg', data.name + '_' + data.date)
      console.log('服务器向浏览器发送消息', data)
    })
  })
}

/*
io: 服务器端所有socket的管理者
socket: 服务器与某个浏览器的连接

on(name, function(socket/data){}): 绑定消息监听
emit(name, data): 向浏览器发送消息
 */