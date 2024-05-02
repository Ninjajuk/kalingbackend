
const express = require('express');
const {createUser,loginUSer,checkAuth,}=require('../controller/auth')
const User = require('../model/UserSchema');
const passport = require('passport');
const router = express.Router();

router.post("/signup", createUser)
      // .post("/login", passport.authenticate("local"), loginUSer)
      // .get('/check',passport.authenticate('jwt'), checkAuth)




exports.router = router;