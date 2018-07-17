var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')

const {UserModel} = require('../db/models')
const filter = {password: 0, __v: 0} // 查询的过滤(去除文档中的指定属性)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
1. 获取请求参数数据
2. 处理数据
3. 返回响应
 */
// 注册一个用户注册的路由接口
/*router.post('/register', function (req, res) {
  // 1. 获取请求参数数据
  const {username, password} = req.body
  // 2. 处理数据
  if(username==='admin') { // 不能注册, 要失败
    // 3. 返回响应
    res.send({code: 1, msg: '用户已存在, 请重新注册!'})
  } else {// 可以注册, 保存数据
    // 将username/password保存到数据库的一个集合中users
    const user = {_id: 'abc123', username, password}
    // 3. 返回响应
    res.send({code: 0, data: user})
  }

})*/

// 注册的路由
router.post('/register', function (req, res) {
  // 1. 获取请求参数数据
  const {username, password, type} = req.body
  // 2. 处理数据
    // 2.1. 根据username查询users集合中对应的user
  UserModel.findOne({username}, function (error, user) {
    // 2.2. 如果有, 说明已经存在,
    if(user) {
      // 3. 返回响应(失败)
      res.send({
        "code": 1,
        "msg": "此用户已存在"
      })
    } else {
      // 2.3. 如果没有, 保存到users中
      new UserModel({username, password: md5(password), type}).save(function (error, user) {

        // 向浏览器返回一个userid的cookie
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})

        // 3. 返回响应(成功)
        res.send({
          "code": 0,
          "data": {username, type, _id: user._id}
        })
      })

    }
  })

})

// 登陆的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body
  // 根据username/password查询users中对应的user
  UserModel.findOne({username, password: md5(password)}, filter, function (error, user) {
    if(user) { // 有, 成功
      // 向浏览器返回一个userid的cookie
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})

      res.send({
        "code": 0,
        "data": user
      })
    } else { // 没有, 失败
      res.send({
        "code": 1,
        "msg": "用户名或密码错误"
      })
    }
  })
})


module.exports = router;
