var express = require('express')
var mysql = require('mysql')
var router = express.Router()
var path = require('path')
var jwt = require('jsonwebtoken');
var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
var connection = mysql.createConnection({
  host : 'localhost',
  port : '3306',
  user : 'root',
  password : 'dlwjdwo95!',
  database : 'seouldb',
  dateStrings: 'date'
})
connection.connect();
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user : 'jjigawesome@gmail.com',
        pass : 'jjigawesome!1234'
    }
});
var request = require('request')
var cheerio = require('cheerio')
router.post('/',function(req, res){
  var token  = req.body.token;
  // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token,'secret' ,(err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
    var searchQuery = connection.query('select * from user where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
        res.json({"number":rows[0].totalstamp , "status":"ok"})

      }
    })

    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
    res.json({"status":"error"})
    }

    // process the promise
    p.then(respond).catch(onError)

})
router.post('/add',function(req,res){
  var id = req.body.ID
  var token = req.body.token
  const p = new Promise(
      (resolve, reject) => {
          jwt.verify(token,'secret' ,(err, decoded) => {
              if(err) reject(err)
              resolve(decoded)
          })
      }
  )
  // if token is valid, it will respond with its info
  const respond = (token) => {
  var searchQuery = connection.query('select * from user where ID = ?',[token.data],function(err,rows){
    if(err)
    {
      console.log("serch")
      console.log(err)
      res.json({"status":"error"})
    }
    else {
      var location = rows[0].name
      var insertQuery = connection.query('insert into stamp values (?,?,?,now(),?,0,0)',[0,id,location,1],function(err,rows){
        if(err)
        {
          console.log("insert")
          console.log(err)
          res.json({"status":"error"})
        }
        else {

          var updateQuery = connection.query('update user SET totalstamp = totalstamp+1 WHERE ID = ?',[id],function(err,rows){
            if(err)
            {
              console.log("update")
              console.log(err)
              res.json({"status":"error"})
            }
            else{
          res.json({ "status":"ok"})
           }
          })

        }
      })
    }
  })

  }
  // if it has failed to verify, it will return an error message
  const onError = (error) => {
  res.json({"status":"error"})
  }

  // process the promise
  p.then(respond).catch(onError)

})
router.post('/used',function(req,res){

  var token  = req.body.token;
  // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token,'secret' ,(err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
    var searchQuery = connection.query('select * from stamp where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
        var jsonArray = new Array();
        for(var i = 0 ; i < rows.length ; i++)
        {
          if(rows[i].remarks < 0)
          {
          var json = new Object();
          json.stampname = rows[i].stampname;
          json.createDate = rows[i].createDate;
          json.remarks = rows[i].remarks;
          jsonArray.push(json);
         }
        }
       res.send(JSON.parse(JSON.stringify(jsonArray)));
      }
    })

    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
    res.json({"status":"error"})
    }

    // process the promise
    p.then(respond).catch(onError)

})
router.post('/expired',function(req,res){
  var token  = req.body.token;
  // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token,'secret' ,(err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {
    var searchQuery = connection.query('select * from stamp where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
       var couponArray = new Array();
       var today = new Date();
        for(var i = 0 ; i < rows.length ; i++)
        {

          if(rows[i].remarks<0 && rows[i].checked == 0)
          {
            var d = new Date(Date.parse(rows[i].createDate));
           if(((d.getFullYear()-today.getFullYear())*365+(3+d.getMonth() - today.getMonth())*30+(d.getDay()-today.getDay())) <30)
            couponArray.push(rows[i]);
          }
        }
       res.send(JSON.parse(JSON.stringify(couponArray)));
      }
    })

    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
    res.json({"status":"error"})
    }

    // process the promise
    p.then(respond).catch(onError)
})
router.post('/hold',function(req,res){
  var token  = req.body.token;
  // create a promise that decodes the token
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token,'secret' ,(err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    // if token is valid, it will respond with its info
    const respond = (token) => {



    var searchQuery = connection.query('select * from stamp where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log(err)
        res.json({"status":"error"})
      }
      else {
       var couponArray = new Array();
        for(var i = 0 ; i < rows.length ; i++)
        {
          if(rows[i].remarks<0 && rows[i].checked == 0)
          {
          couponArray.push(rows[i])
          }

        }

       res.send(JSON.parse(JSON.stringify(couponArray)));
      }
    })

    }

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
    res.json({"status":"error"})
    }

    // process the promise
    p.then(respond).catch(onError)

})
router.post('/exchange',function(req,res){
var couponType = req.body.type
var couponStamp = req.body.stamp //필요 스탬프 갯수
var token = req.body.token
var couponname
var logo
var user_email
const p = new Promise(
    (resolve, reject) => {
        jwt.verify(token,'secret' ,(err, decoded) => {
            if(err) reject(err)
            resolve(decoded)
        })
    }
)

// if token is valid, it will respond with its info
const respond = (token) => {
console.log(token.data)
var findCoupon = connection.query('select * from coupon where  type= ? ',[couponType],function(err,rows){
if(err){
  console.log("findCouponErr")
  console.log(err)
  res.json({"status":"error"})
}
else {
couponname = rows[0].couponname
logo = rows[0].logo
}
})

var updateQuery = connection.query('update user SET totalstamp = totalstamp-? WHERE ID = ?',[couponStamp,token.data],function(err,rows){
  if(err)
  {
    console.log("updateErr")
    console.log(err)
    res.json({"status":"error"})
  }
  else {//else시작
    var insertQuery = connection.query('insert into stamp values(0,?,?,now(),?,0,?)',[token.data,couponname,-couponStamp,logo],function(err,rows){
      if(err)
      {
        console.log("insertErr")
        console.log(err)
        res.json({"status":"error"})
      }
      else {
        //email 보내기
       res.json({"status":"ok"})
  }
})
} //else끝
})
}
// if it has failed to verify, it will return an error message
const onError = (error) => {
res.json({"status":"error"})
}

// process the promise
p.then(respond).catch(onError)
})



router.post('/email',function(req, res){

  var num = req.body.num
  var token = req.body.token
  var user_email

  const p = new Promise(
      (resolve, reject) => {
          jwt.verify(token,'secret' ,(err, decoded) => {
              if(err) reject(err)
              resolve(decoded)
          })
      }
  )

  // if token is valid, it will respond with its info
  const respond = (token) => {
    var findIdQuery = connection.query('select * from user where ID = ?',[token.data],function(err,rows){
      if(err)
      {
        console.log("findIDErr")
        console.log(err)
        res.json({"status":"error"})
        res.end()
      }
      else {
        user_email = rows[0].email
        //
        var findCouponQuery = connection.query('select * from  stamp where num = ?',[num],function(err,rows){
          if(err)
          {
            console.log("findErr")
            console.log(err)
            res.json({"status":"error"})
          }
          else {
            var mailOption = {
              from : 'jjigawesome@gmail.com',
              to : user_email,
              subject : '찍어썸 쿠폰 발급 안내',
              text : rows[0].stampname+"쿠폰이 발급 되었습니다."
          };
          transporter.sendMail(mailOption, function(err, info) {
              if ( err ) {
                res.json({"status":"error"})
                  console.error('Send Mail error : ', err);
              }
              else {
                  var updateQuery = connection.query('update stamp set checked = ? where num = ?',[1,parseInt(num)],function(err,rows){
                    if(err)
                    {
                      console.log("updateErr")
                      console.log(err)
                      res.json({"status":"error"})
                    }
                    else
                    {

                    res.json({"status":"ok"})
                      console.log('Message sent : ', info);
                    }
                 })
              }
        })

        }

        })

        //
      }
    })
  }


  // if it has failed to verify, it will return an error message
  const onError = (error) => {
  res.json({"status":"error"})
  }

  // process the promise
  p.then(respond).catch(onError)

})

router.post('/info',function(req,res){

var searchQuery = connection.query('select * from coupon',function(err,rows){
if(err)
{
  console.log(err)
  res.json({"status":"error"})
}
else {
   res.send(JSON.parse(JSON.stringify(rows)));
}
})
})

router.post('/couponlist',function(req,res){
var thema = req.body.thema
// create a promise that decodes the token
  const p = new Promise(
      (resolve, reject) => {
          jwt.verify(token,'secret' ,(err, decoded) => {
              if(err) reject(err)
              resolve(decoded)
          })
      }
  )

  // if token is valid, it will respond with its info
  const respond = (token) => {
  var searchQuery = connection.query('select * from coupon where thema = ?',[thema],function(err,rows){
    if(err)
    {
      console.log(err)
      res.json({"status":"error"})
    }
    else {
      res.send(JSON.parse(JSON.stringify(rows)));
    }
  })

  }
  // if it has failed to verify, it will return an error message
  const onError = (error) => {
  res.json({"status":"error"})
  }
  // process the promise
  p.then(respond).catch(onError)
})

module.exports = router;
