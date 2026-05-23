const express = require('express');
const datasetController = require('../controllers/datasetController');

const router = express.Router();

// Search routes matching: GET /api/v1/search/datasets?q=keyword
router.get('/datasets', datasetController.searchDatasets);

module.exports = router;
