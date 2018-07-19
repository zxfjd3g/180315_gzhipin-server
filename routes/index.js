var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')

const {UserModel} = require('../db/models')
const filter = {password: 0, __v: 0} // 查询的过滤(去除文档中的指定属性)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
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
    if (user) {
      // 3. 返回响应(失败)
      res.send({
        "code": 1,
        "msg": "此用户已存在"
      })
    } else {
      console.log('---', req.body)
      // 2.3. 如果没有, 保存到users中
      new UserModel({username, password: md5(password), type}).save(function (error, user) {

        // 向浏览器返回一个userid的cookie
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})

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
    if (user) { // 有, 成功
      // 向浏览器返回一个userid的cookie
      res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})

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

// 更新用户路由
router.post('/update', function (req, res) {
  // 得到请求cookie的userid
  const userid = req.cookies.userid
  if (!userid) {// 如果没有, 说明没有登陆, 直接返回提示
    return res.send({code: 1, msg: '请先登陆'});
  }

  // 更新数据库中对应的数据
  UserModel.findByIdAndUpdate({_id: userid}, req.body, function (err, user) {// user是数据库中原来的数据
    const {_id, username, type} = user
    // node端 ...不可用
    // const data = {...req.body, _id, username, type}
    // 合并用户信息
    const data = Object.assign(req.body, {_id, username, type})
    // assign(obj1, obj2, obj3,...) // 将多个指定的对象进行合并, 返回一个合并后的对象
    res.send({code: 0, data})
  })
})

// 根据cookie获取对应的user
router.get('/user', function (req, res) {
  // 取出cookie中的userid
  const userid = req.cookies.userid
  if(!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }

  // 查询对应的user
  UserModel.findOne({_id: userid}, filter, function (err, user) {
    return res.send({code: 0, data: user})
  })
})


module.exports = router;
