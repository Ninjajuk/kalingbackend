const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const {generateOTP}=require('../services/helper')
const {sendMail}=require('../services/common')
const User = require('../model/UserSchema');
const transporter = require('../services/common');
const { resetPassworEmailTemplate } = require('../services/emailTemplate');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


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
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      let newuser = new User({name, email, phone, password: hashedPassword, role, addresses, resetPasswordToken });
      // console.log('Before saving new user:', newuser);
 
      await newuser.save();
// const payLoad={
//   name, email, phone
// }
//       let token= await generateSignature(payLoad,)
      // console.log('User saved successfully.');
      resp.status(201).json({ message: 'User registered successfully.', user: newuser }); // Changed from resp.json() to resp.status(201).json()

  
    } catch (error) {
      console.error('Error registering user:', error);
      resp.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };

  exports.loginUser = async (req, resp) => {
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
                // If authentication is successful, generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); 

      // Set the token in a cookie
      resp.cookie('token', token, { expires:new Date(Date.now() + 25892000000),httpOnly: true, });

      return resp.status(200).json({ success: "Logged in successfully", user,token });
        } else {
          resp.status(401).json({ error: "Incorrect password" });
        }
      }
    } catch (error) {
      console.log("Error finding user:", error);
      resp.status(500).json({ error: "Internal Server Error" });
    }
  };
  exports.checkAuth = async (req, res) => {
    if (req.user) {
      res.json(req.user,);
    } else {
      res.sendStatus(401);
    }
  };

  exports.logout = async (req, res) => {
    res
      .cookie('jwt', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .sendStatus(200)
  };

  exports.resetPasswordRequest = async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });
      const username=user.name
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); 
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      await user.save();
  
      const resetPageLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

      //Send Mail For reset Paswword verification
    let mailPayload = {
      to: email,
      html:resetPassworEmailTemplate(resetPageLink,username) ,
      subject: 'Reset Password for YingKiong Store',
    }
  

      const response = await transporter.sendMail(mailPayload);
      res.status(200).json({response,message:'Token send to email successfully '});
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const { email, password, token } = req.body;
      const user = await User.findOne({ email, resetPasswordToken: token });
      if (!user) {
        // If no user is found with the given email and token
        return res.status(404).json({ error: "Invalid token" });
      }
  
      // Check if token has expired
      if (user.resetPasswordExpires < Date.now()) {
        // If token has expired
        return res.status(401).json({ error: "Expired token" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      const subject = 'Password successfully reset for YingKiong Store';
      const html = `<p>Your password has been successfully reset</p>`;
      await transporter.sendMail({ to: email, subject, html });
  
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Internal Server Error" });
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