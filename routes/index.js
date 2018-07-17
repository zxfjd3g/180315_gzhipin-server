var express = require('express');
var router = express.Router();

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
router.post('/register', function (req, res) {
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

})

module.exports = router;
