const jwt = require("jsonwebtoken");
const JWTSECRET = process.env.JWT_SECRET_KEY;

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  exports.generateSignature = async (payload, expiresIn = '1w') => {
    return jwt.sign(payload, JWTSECRET, { expiresIn })
}

exports.validateSignature = async (token) => {
    return jwt.verify(token, JWTSECRET);
}
