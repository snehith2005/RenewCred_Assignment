const express = require('express');
const { login, logout, me } = require('../controllers/authController');
const protectRoute = require('../middleware/authMiddleware');
const { validateBody, loginSchema } = require('../middleware/validate');

const router = express.Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/logout', protectRoute, logout);
router.get('/me', protectRoute, me);

module.exports = router;
