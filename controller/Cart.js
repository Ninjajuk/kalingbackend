const { Cart } = require('../model/CartSchema');
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.fetchCartByUser = async (req, res) => {
  try {
    // Extract token from the Authorization header
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

    // Fetch cart items for the user
    const cartItems = await Cart.find({ user: userId }).populate('product');
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(400).json({ error: "Failed to fetch cart items" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    // Access token from request cookies
    // const token = req.cookies.token;
    // console.log(token)

    // if (!token) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // }

    // // Verify the token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use the same secret key used for signing the token in loginUser

    // // Assuming decoded contains userId
    // const userId = decoded.userId;
    // Now you can proceed to add to cart using userId
    const { quantity, product: productId,user} = req.body;
  
// console.log(user)
    const cart = new Cart({ quantity, product: productId, user,});
    const savedCart = await cart.save();
    const populatedCart = await savedCart.populate('product')
    
    res.status(201).json(populatedCart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(400).json({ error: "Failed to add to cart" });
  }
};


exports.deleteFromCart = async (req, res) => {
    const { id } = req.params;
    try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    const result = await cart.populate('product');

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};