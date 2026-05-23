const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Define analytics routes matching: GET /api/v1/analytics/datasets/...
router.get('/datasets/type-analysis', analyticsController.getTypeAnalysis);
router.get('/datasets/repo-analysis', analyticsController.getRepoAnalysis);
router.get('/datasets/source-analysis', analyticsController.getSourceAnalysis);
router.get('/datasets/framework-analysis', analyticsController.getFrameworkAnalysis);
router.get('/datasets/language-analysis', analyticsController.getLanguageAnalysis);
router.get('/datasets/code-analysis', analyticsController.getCodeAnalysis);
router.get('/datasets/doc-analysis', analyticsController.getDocAnalysis);
router.get('/datasets/readme-analysis', analyticsController.getReadmeAnalysis);
router.get('/datasets/ml-analysis', analyticsController.getMLAnalysis);
router.get('/datasets/ai-analysis', analyticsController.getAIAnalysis);

module.exports = router;
