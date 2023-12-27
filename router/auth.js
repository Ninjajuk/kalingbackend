
const express = require('express');
const {createUser,generateOTP}=require('../controller/auth')
const User = require('../model/UserSchema');
const router = express.Router();

router.post('/signup',createUser )
       .get('/send-otp/:userId',generateOTP)
       .get('/user',async(req,resp)=>{
        try {
            const doc=await User.find({}) 
            resp.json(doc)
            console.log(doc)
        } catch (error) {
            resp.status(500).json({ error: 'Internal Server Error' });
        }

       })


exports.router = router;