

// Generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //Generate OrderId
  exports.generateOrderId=()=> {
    const randomNumber = Math.floor(10000 + Math.random() * 90000);
    const randomString = Math.random().toString(6).substring(2, 4);
    const timestamp = Date.now();
    const orderId = `ORD-${randomNumber}-${randomString}-${timestamp}`;
    return orderId;
}

