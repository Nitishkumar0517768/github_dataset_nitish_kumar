const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

// Define stats routes matching: GET /api/v1/stats/datasets/...
router.get('/datasets/count', statsController.getTotalCount);
router.get('/datasets/functions', statsController.getFunctionsCount);
router.get('/datasets/classes', statsController.getClassesCount);
router.get('/datasets/documentation', statsController.getDocumentationCount);
router.get('/datasets/readme', statsController.getReadmeCount);
router.get('/datasets/repos', statsController.getReposCount);
router.get('/datasets/languages', statsController.getLanguagesCount);
router.get('/datasets/frameworks', statsController.getFrameworksCount);
router.get('/datasets/github', statsController.getGithubCount);
router.get('/datasets/ai', statsController.getAICount);

module.exports = router;
