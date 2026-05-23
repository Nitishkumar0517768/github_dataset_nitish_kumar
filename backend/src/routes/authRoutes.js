const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-email', authController.verifyEmail);

// Protected routes (Good to Have 17)
router.use(protect); // Applies protection guard globally to the routes below
router.route('/profile')
  .get(authController.getProfile)
  .patch(authController.updateProfile);
router.post('/change-password', authController.changePassword);

module.exports = router;
