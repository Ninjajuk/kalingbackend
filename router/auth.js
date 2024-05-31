
const express = require('express');
const {createUser,logout,getAllUser,loginUser,checkAuth,generateOTP,verifyOtp,resetPasswordRequest,resetPassword}=require('../controller/auth')
const User = require('../model/UserSchema');
const { authenticateToken } = require('../middlleware/authenticateToken');
const { updateUser } = require('../controller/User');
const router = express.Router();

router.post('/signup',createUser )
      .post('/login',loginUser)
      .get('/logout', logout)
      .get('/check',authenticateToken, checkAuth)
      .post('/reset-password-request', resetPasswordRequest)
      .post('/reset-password', resetPassword)
      .post('/send-otp/',generateOTP)
      .post('/verify-otp',verifyOtp)
      .get('/user',getAllUser)
      .patch('/:id', updateUser)



exports.router = router;