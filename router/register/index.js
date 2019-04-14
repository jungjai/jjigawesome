var express = require('express')
var mysql = require('mysql')
var app = express()
var router = express.Router();
var path = require('path')
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'dlwjdwo95!',
  database : 'seouldb'
})
connection.connect();
router.post('/',function(req, res){
var body = req.body;
var name = body.name;
var id = body.ID;
var pw = body.password;
var email = body.email;
var type = body.type;
console.log(body);
var sql = {"name":name,"ID":id,"password":pw,"email":email,"type":type,"totalstamp":0}
var searchQuery = connection.query('select * from user where ID = ?',[id],function(err,rows){
  if(err)
  {
    console.log(err);
    var msg = {"status": "ERROR_ID"}
    res.json(msg)
    return;
  }
  if(rows.length > 0)
  {
    console.log(rows);
    var msg = {"status": "ERROR_ID"}
    res.json(msg)
    return;
  }
  var registerquery = connection.query('insert into user set ?',sql, function(err,rows){
    if(err){
      console.log(err)
      var msg = {"status": "ERROR_EMAIL"}
      res.json(msg)
      return;
    }
    var msg = {"status":"ok"}
    res.json(msg)
  })
})
})
module.exports = router;
