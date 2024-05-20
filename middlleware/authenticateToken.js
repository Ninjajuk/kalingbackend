const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};