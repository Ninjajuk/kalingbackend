
const express = require('express');
const {createUser,getUserbyEmail,getAllUser,getUserbyId,generateOTP,verifyOtp}=require('../controller/auth')
const User = require('../model/UserSchema');
const router = express.Router();

router.post('/signup',createUser )
      .get('/login',getUserbyEmail)
       .get('/send-otp/:email',generateOTP)
       .post('/verify-otp',verifyOtp)
       .get('/user',getAllUser)
       .get('/user/:email',getUserbyId)


exports.router = router;