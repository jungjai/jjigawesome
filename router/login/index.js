var express = require('express')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session);
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var jwt = require('jsonwebtoken');
var mysql = require('mysql')
var path = require('path')
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'dlwjdwo95!',
  database : 'seouldb'
})
connection.connect();
router.post('/',function(req,res){
var id = req.body.ID
var password = req.body.password
var searchQuery = connection.query('select * from user where ID = ?',[id],function(err,rows){
  if(err)throw err
  if(rows.length < 1)
  {
    var msg = {"status": "ID_ERROR"}
    res.json(msg)
    return;
  }
  else {
    console.log(rows[0].password);
    if(rows[0].password === password){
     //토큰 값 DB저장 및 보내기
     var token =jwt.sign({
       data: id
     }, 'secret', { expiresIn: '1h' });
     console.log(token);
     //var token = tokenHelper.tokenGenerator();
     var name = rows[0].name;
     var type = rows[0].type;
     var email = rows[0].email;
     var respone = {'status':'ok','token':token,'name':name,'type':type,'email':email}
     res.json(respone);
    return;
    }
    else {
      var msg = {"status": "PW_ERROR"}
      res.json(msg)
      return;
    }
  }
})
})

module.exports = router;
