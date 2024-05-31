// const { Category } = require('../model/Category');
const { default: mongoose } = require('mongoose');
const User = require('../model/UserSchema');
const jwt = require('jsonwebtoken');

exports.fetchUserById = async(req, res) => {

  const authHeader = req.headers.authorization;
  // console.log('Authorization Header:', req.headers.authorization);

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.userId;
  // console.log(userId)

  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log('User:', user);

    res.status(200).json({ user, message: 'User from backend' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  // console.log(id)
  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({user,message:'User Updated successfully'});
  } catch (err) {
    res.status(400).json(err);
  }
};