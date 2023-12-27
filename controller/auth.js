const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const {generateOTP}=require('../services/helper')
const User = require('../model/UserSchema');

exports.createUser = async (req, resp) => {
    const { email, phone, password, role, addresses, resetPasswordToken } = req.body;
  
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return resp.status(409).json({ error: 'Email or phone number already in use.' });
      }
  
      console.log('Received registration request:', email, phone, password, role, addresses, resetPasswordToken);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      let newuser = new User({ email, phone, password: hashedPassword, role, addresses, resetPasswordToken });
      console.log('Before saving new user:', newuser);
  
      await newuser.save();
      console.log('User saved successfully.');
      resp.json({ message: 'User registered successfully.' });
  
    } catch (error) {
      console.error('Error registering user:', error);
      resp.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };

exports.generateOTP=async(req,resp)=>{
    const userId = req.params.userId;
    try {

    // const user = await User.findById(userId);
    } catch (error) {
        
    }
}