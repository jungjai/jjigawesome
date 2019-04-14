var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var rn = require('random-number');
var auth = require('./auth')
var jwt = require('jsonwebtoken');

router.use('/auth', auth)
var gen = rn.generator({
  min: 100000,
  max: 999999,
  integer: true
})
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jjigawesome@gmail.com',
    pass: 'jjigawesome!1234'
  }
});
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password : 'dlwjdwo95!',
  database : 'seouldb'
})
connection.connect();

router.post('/id', function(req, res) {
  var user_email = req.body.email;
  var findQurey = connection.query('select * from user where email=?', [user_email], function(err, rows) {
    if (err) throw err;
    if (rows.length > 0) {
      var mailOption = {
        from: 'jjigawesome@gmail.com',
        to: user_email,
        subject: '찍어썸 아이디 안내',
        text: rows[0].ID
      };
      transporter.sendMail(mailOption, function(err, info) {
        if (err) {
          console.error('Send Mail error : ', err);
        } else {
          console.log('Message sent : ', info);
        }
      });
      res.json({
        "status": "ok"
      });
    } else {
      res.json({
        "status": "error"
      });
    }
  })

})
//아이디랑 이메일 일치 하는지, 인증 했던 DB에 record 삭제
router.post('/password', function(req, res) {
  var user_id = req.body.id;
  var user_email = req.body.email;
  var findQurey = connection.query('select * from user where ID =?', [user_id], function(err, rows) {
    if (err) {
      console.log(err)
      res.json({
        "status": "error"
      });
      //콜백으로 동작
      auth.rmAuth(user_email);
      return;
    } else if (rows.length > 0 && (rows[0].email == user_email)) {
      res.json({
        "status": "ok"
      });
      //콜백으로 동작
      auth.rmAuth(user_email);
      return;
    } else {
      res.json({
        "status": "error"
      });
    }
  })
})

//인증번호 맞는지 체크
router.post('/check', function(req, res) {
  var user_auth = req.body.auth_num
  var user_email = req.body.email;
  var findQurey = connection.query('select * from find_pw where email =?', [user_email], function(err, rows) {
    if (err) throw err;

    if (rows.length > 0) {
      if (user_auth == rows[rows.length - 1].auth_num) {
        //콜백으로 동작
        auth.rmAuth(user_email);
        res.json({
          "status": "ok"
        });
      } else {
        res.json({
          "status": "error"
        });
      }
    }
  })
})
//비밀번호 재설정
router.post('/reset', function(req, res) {
      if (req.body.token) {
        var token = req.body.token;
        // create a promise that decodes the token
        const p = new Promise(
          (resolve, reject) => {
            jwt.verify(token, 'secret', (err, decoded) => {
              if (err) reject(err)
              resolve(decoded)
            })
          }
        )

        // if token is valid, it will respond with its info
        const respond = (token) => {
          var user_pw = req.body.password
          var user_id = token.data
          var sql = [user_pw,user_id]

          query = connection.query('select * from user where ID =?', [user_id], function(err, rows) {
              if (err) {
                res.json({
                  "status": "error"
                })
              } else {
                console.log(1234)
                if (rows.length>0) {
                  console.log(1)


                  var query = connection.query('update user set password =?  where ID =? ', sql, function(err, rows) {
                    if (err) {
                      console.log(err)
                      res.json({
                        "status": "error"
                      })
                    } else {
                      console.log(2)
                      // if(rows[0] >0)
                      // {
                      //console.log(rows[0]);
                      res.json({
                        "status": "ok"
                      })
                      // }
                      // else {
                      //   res.json({"status":"error"})
                      // }
                    }

                  })

                } else {
                  console.log(124)
                  res.json({
                    "status": "error"
                  })
                }

              }
        })

        }

        // if it has failed to verify, it will return an error message
        const onError = (error) => {
          res.json({
            "status": "error"
          })
        }

        // process the promise
        p.then(respond).catch(onError)

      } else {
        var user_pw = req.body.password;
        var user_email = req.body.email;
        var sql = [user_pw, user_email]
        query = connection.query('select * from user where email =?', [user_email], function(err, rows) {
            if (err) {
              res.json({
                "status": "error"
              })
            } else {
              if (rows.length>0) {
                console.log(1)
                var query = connection.query('update user set password =?  where email =? ', sql, function(err, rows) {
                  if (err) {
                    console.log(err)
                    res.json({
                      "status": "error"
                    })
                  } else {
                    console.log(2)
                    // if(rows[0] >0)
                    // {
                    //console.log(rows[0]);
                    res.json({
                      "status": "ok"
                    })
                    // }
                    // else {
                    //   res.json({"status":"error"})
                    // }
                  }

                })
              } else {
                console.log(3)
                res.json({
                  "status": "error"
                })
              }

            }
      })
    }
  })



    router.post('/check_password', function(req, res) {
      var token = req.body.token;

      // create a promise that decodes the token
      const p = new Promise(
        (resolve, reject) => {
          jwt.verify(token, 'secret', (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
          })
        }
      )

      // if token is valid, it will respond with its info
      const respond = (token) => {
        var user_pw = req.body.password
        var user_id = token.data
        var findQuery = connection.query('select * from user where ID =?', [user_id], function(err, rows) {
          if (err) {
            console.log(err)
            res.json({
              "status": "error"
            });
          } else {
            if (rows[0].password == user_pw) {
              res.json({
                "status": "ok"
              });
            } else {
              res.json({
                "status": "error"
              });
            }
          }

        })

      }

      // if it has failed to verify, it will return an error message
      const onError = (error) => {
        res.json({
          "status": "error"
        })
      }

      // process the promise
      p.then(respond).catch(onError)
    })

    router.post('/reset_name', function(req, res) {
      var token = req.body.token
      const p = new Promise(
        (resolve, reject) => {
          jwt.verify(token, 'secret', (err, decoded) => {
            if (err) reject(err)
            resolve(decoded)
          })
        }
      )

      // if token is valid, it will respond with its info
      const respond = (token) => {
        var user_revise_name = req.body.name
        var user_id = token.data
        var resetQuery = connection.query('update user set name =? where ID =?', [user_revise_name, user_id], function(err, rows) {
          if (err) {
            console.log(err)
            res.json({
              "status": "error"
            });
          } else {

            res.json({
              "status": "ok"
            });
          }

        })
      }

      // if it has failed to verify, it will return an error message
      const onError = (error) => {
        res.json({
          "status": "error"
        })
      }

      // process the promise
      p.then(respond).catch(onError)
    })

    module.exports = router;
