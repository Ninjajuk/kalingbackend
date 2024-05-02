const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const {generateOTP, generateSignature}=require('../services/helper')
const User = require('../model/UserSchema');
const transporter = require('../services/common');


// Store OTPs for verification
const otpStore = new Map();

exports.createUser = async (req, resp) => {
    const {name, email, phone, password, role, addresses, resetPasswordToken } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return resp.status(409).json({ error: 'Email or phone number already in use.' });
      }
  
      console.log('Received registration request:',name, email, phone, password, role, addresses, resetPasswordToken);
      const hashedPassword = await bcrypt.hash(password, 10);       // Hash the password
  

      let newuser = new User({name, email, phone, password: hashedPassword, role, addresses, resetPasswordToken });    // Create a new user with the hashed password
      // console.log('Before saving new user:', newuser);
      
          // create token
    const payload = {
      name, email, phone, password: hashedPassword, role, addresses
    }

    // tokens expiry time set to 5m
    const expiryTime = '5m'

    const token = await generateSignature(payload, expiryTime);
 
      await newuser.save();
      console.log('User saved successfully.')

              // Set the token as a cookie
              resp.cookie('token', token, {
                httpOnly: true,
                // maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
                expires: new Date(Date.now() + 3600000)
                // secure: process.env.NODE_ENV === 'production' // Set secure to true in production
            });
      resp.status(201).json({ message: 'User registered successfully.', user: newuser,token:token }); // Changed from resp.json() to resp.status(201).json()

  
    } catch (error) {
      console.error('Error registering user:', error);
      resp.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };

  exports.getUserbyId = async (req, resp) => {
    const { email, password } = req.body;
    try {
      // Check if user is present or not
      const user = await User.findOne({ email: email });
      if (!user) {
        resp.status(404).json({ error: "User not found.Please register!" });
      } else {
        // Compare the provided password with the hashed password stored in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
  
        if (isPasswordMatch) {
          resp.status(200).json({ success: "Logged in successfully", user });
        } else {
          resp.status(401).json({ error: "Incorrect password" });
        }
      }
    } catch (error) {
      console.log("Error finding user:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  };

exports.generateOTP=async(req,resp)=>{
    // Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const {email} = req.body;
  // Generate OTP
  const otp = generateOTP();
console.log(email,otp)
  // Save OTP in the store
  otpStore.set(email, otp);

  // Configure email options
  const mailOptions = {
    from: 'codewizardsam@gmail.com', 
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for email verification is: ${otp}`,
  };

    try {
       // Send email
   transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return resp.status(500).json({ error: 'Error sending OTP email' });
        }
        resp.status(200).json({ message: 'OTP sent successfully' });
      })
    } catch (error) {
        console.log('server errror')
    }
}

// Verify OTP and issue JWT token
exports.verifyOtp=async(req,resp)=>{
  const { email, userOTP } = req.body;
  try {
  // Get stored OTP
  const storedOTP = otpStore.get(email);

  if (!storedOTP) {
    return resp.status(400).json({ error: 'OTP not generated for this email' });
  }

  // Verify OTP
  if (userOTP === storedOTP) {

    // OTP is valid Generate and sign JWT token
// const token = jwt.sign({ email }, process.env.SECRET_KEY_JWT, { expiresIn: '1h' }); 

  // Saved token in the user's document
  await User.findOneAndUpdate({ email }, { $set: { token } });
    resp.status(200).json({ message: 'OTP verification successful' });
  } else {
    resp.status(400).json({ error: 'Invalid OTP' });
  }
  } catch (error) {
    console.log('server errror')
  }
}

exports.getAllUser=async(req,resp)=>{
  try {
    const user=await User.find()
    resp.status(200).json(user)
  } catch (error) {
    console.log('Server Error')
  }
}

