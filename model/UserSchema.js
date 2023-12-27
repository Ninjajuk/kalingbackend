const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default:'user' },
  addresses: { type: [Schema.Types.Mixed] }, 
  resetPasswordToken: {type: String, default:''}
},{timestamps: true});


const User = mongoose.model('User', userSchema);

module.exports = User 



