var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var rn = require('random-number');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');

var user_email

let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user : 'jjigawesome@gmail.com',
        pass : 'jjigawesome!1234'
    }
});
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'dlwjdwo95!',
  database : 'seouldb'
})
router.rmAuth = function (user_email){
    var deleQuery = connection.query('delete from find_pw where email=?',[user_email],function(err,rows){
      if(err){
		console.log(err);
	} else {
		console.log(rows);
	}
})
}
router.post('/register',function(req,res){
user_email = req.body.email;
 var auth_number =  gen();
 var mailOption = {
   from : 'jjigawesome@gmail.com',
   to : user_email,
   subject : '찍어썸 인증번호 안내',
   text : auth_number+""
 };
 transporter.sendMail(mailOption, function(err, info) {
   console.log("sendMail");
   if ( err ) {
       console.error('Send Mail error : ', err);
       res.json({"status":"error"})
   }
   else {
       console.log('Message sent : ', info);
       res.json({"status":"ok"})
   }
 });
 var insertquery = connection.query('insert into find_pw values(?,?,?);',["0",user_email,auth_number],function(err,rows){
   console.log("insertquery");
 if(err){
 console.log(err);
 res.json({"status":"error"})
 }
 //pk = rows;
 console.log("insert")
 console.log(user_email+"  "+auth_number);
 })

})
//이메일로 인증번호 6자리 보냄
router.post('/',function(req,res){
//var user_id = req.query.id;
 user_email = req.body.email;
var auth_number =  gen();
var mailOption = {
  from : 'jjigawesome@gmail.com',
  to : user_email,
  subject : '찍어썸 인증번호 안내',
  text : auth_number+""
};

//해당 이메일 있는지
var findQurey = connection.query('select * from user where email=?',[user_email],function(err,rows){
    console.log("findQuery");
if(err){
  console.log(err)
  return
}
else{
if(rows.length > 0)
{
//DB에 추가
var insertquery = connection.query('insert into find_pw values(?,?,?);',["0",user_email,auth_number],function(err,rows){
  console.log("insertquery");
if(err){
console.log(err);
res.json({"status":"error"})
return
}

//pk = rows;
console.log("insert")
console.log(user_email+"  "+auth_number);
})
transporter.sendMail(mailOption, function(err, info) {
  console.log("sendMail");
  if ( err ) {
      console.error('Send Mail error : ', err);
      res.json({"status":"error"})
      return
  }
  else {
      console.log('Message sent : ', info);
    res.json({"status":"ok"})
  }
});
res.json({"status":"ok"});
}
else {

  res.json({"status":"error"});
}

}
})
})
module.exports = router;
