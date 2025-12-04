const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validatePassword } = require('../middleware/authMiddleware');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Password must be 8-16 chars, contain 1 Upper & 1 Special char." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ name, email, password: hashedPassword, address, role: 'normal_user' });
    
    res.status(201).json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; 

  try {
    // 1. Find User
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Verify Old Password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // 3. Validate New Password 
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        message: "New password must be 8-16 chars, 1 Uppercase, 1 Special Char." 
      });
    }

    // 4. Hash & Update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};