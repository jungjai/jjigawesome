var express = require('express')
var router = express.Router();
var path = require('path')

var login = require('./login/index')
var register = require('./register/index')
var home = require('./stamp/index')
var find  = require('./find/index')
router.use('/login',login)
router.use('/register',register)
router.use('/stamp',home)
router.use('/find',find)
module.exports = router;
