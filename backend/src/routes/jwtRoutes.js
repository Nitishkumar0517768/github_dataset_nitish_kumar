const express = require('express');
const authController = require('../controllers/authController');
const datasetController = require('../controllers/datasetController');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public JWT Utilities
router.post('/generate-token', authController.generateToken);
router.post('/verify-token', authController.verifyToken);
router.post('/refresh-token', authController.refreshToken);
router.delete('/revoke-token', authController.revokeToken);

// Protected JWT Routes (Good to Have 17)
router.use(protect); // Applies protection guard globally below

router.get('/profile', authController.getProfile);

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Access granted to JWT dashboard for user: ${req.user.name}`
  });
});

router.get('/private-datasets', datasetController.getAllDatasets);
router.get('/private-analytics', analyticsController.getTypeAnalysis);

module.exports = router;
