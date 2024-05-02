
const express = require('express');
const {createUser,getUserbyEmail,getAllUser,loginUser,generateOTP,verifyOtp}=require('../controller/auth')
const User = require('../model/UserSchema');
const router = express.Router();

router.post('/signup',createUser )
      .post('/login',loginUser)
       .post('/send-otp/',generateOTP)
       .post('/verify-otp',verifyOtp)
       .get('/user',getAllUser)



exports.router = router;