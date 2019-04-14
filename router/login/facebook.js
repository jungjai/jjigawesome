var express = require('express')
var router = express.Router();
var passport = require('passport')
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
router.get('/',function(req, res){
  console.log("접속");
});

module.exports = router;
