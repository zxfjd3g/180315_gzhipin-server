/*
使用mongoose操作mongodb的测试文件
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model或其实例对集合数据进行CRUD操作
  3.1. 通过Model实例的save()添加数据
  3.2. 通过Model的find()/findOne()查询多个或一个数据
  3.3. 通过Model的findByIdAndUpdate()更新某个数据
  3.4. 通过Model的remove()删除匹配的数据
 */
/*1. 连接数据库*/
// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test3')
// 1.3. 获取连接对象
const connection = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
connection.on('connected', function () {
  console.log('连接数据库成功!')
})

/*2. 得到对应特定集合的Model*/
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  type: {type: String}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('users', userSchema) // 集合的名称为: users


/*3. 通过Model或其实例对集合数据进行CRUD操作*/
// 3.1. 通过Model实例的save()添加数据
function testSave() {
  const user = {username: 'Tom2', password: '321'}
  const userModel = new UserModel(user)
  userModel.save(function (error, user) {
    console.log(error, user)
  })
}
// testSave()

// 3.2. 通过Model的find()/findOne()查询多个或一个数据
function testFind() {
  // findOne() 返回一个匹配的user, 如果没有返回null
  UserModel.findOne({_id: '5b4d86fea412ec45b4d654d6'}, function (error, user) {
    console.log('findOne', error, user)
  })
  // find() 返回所有匹配的user组成的数组, 如果没有返回[]
  UserModel.find({_id: '5b4d86fea412ec45b4d654d6'}, function (error, users) {
    console.log('find', error, users)
  })
}
// testFind()

// 3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
  UserModel.findByIdAndUpdate({_id:'5b4d86fea412ec45b4d654d7'}, {username: 'Jack'},
    function (error, oldUser) { // 返回原来的user
    console.log('update', error, oldUser)
  })
}
// testUpdate()

// 3.4. 通过Model的remove()删除匹配的数据
function testRemove() {
  UserModel.remove({_id:'5b4d86fea412ec45b4d654d7'}, function (error, doc) {
    console.log('remove', error, doc) // { n: 1, ok: 1 } n:1代表删除了1条记录
  })
}
testRemove()
