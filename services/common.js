
require('dotenv').config();
const passport = require('passport');
const nodemailer = require('nodemailer');

const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSKEY_EMAIL,
    },
  });
  module.exports = transporter;


  exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
  };
  
  exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role };
  };
  
  exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  };

  exports.sendMail = async function ({ to, subject, text, html }) {
    try {
      console.log('Sending email to:', to);
      let info = await transporter.sendMail({
        from: '"Yingkiong Store" <codewizardsam@gmail.com>', // sender address
        to,
        subject,
        text,
        html
      });
  
      console.log('Email sent successfully:', info);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Rethrow the error so that it can be caught in the calling function
    }
  };
  


