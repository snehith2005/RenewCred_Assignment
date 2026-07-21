const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (admin) =>
  jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = signToken(admin);

    res.json({
      success: true,
      token,
      admin: admin.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/logout
// JWTs are stateless, so logout is handled by the client discarding the
// token. This endpoint exists for a consistent API surface and as a place
// to hook in token blacklisting / refresh-token revocation later if needed.
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/v1/auth/me
const me = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, admin: admin.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, me };
