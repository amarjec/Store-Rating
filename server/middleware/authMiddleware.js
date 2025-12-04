const jwt = require('jsonwebtoken');


exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const bearer = token.split(" ")[1];
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access Denied: Insufficient Permissions' });
  }
  next();
};


exports.validatePassword = (password) => {
  // 8-16 chars, 1 Uppercase, 1 Special Char
  const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,16})/;
  return regex.test(password);
};