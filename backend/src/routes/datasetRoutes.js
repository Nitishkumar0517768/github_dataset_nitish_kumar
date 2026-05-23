const express = require('express');
const datasetController = require('../controllers/datasetController');

const router = express.Router();

// Define basic CRUD routes
router.route('/')
  .get(datasetController.getAllDatasets)
  .post(datasetController.createDataset);

router.route('/:id')
  .get(datasetController.getDatasetById)
  .put(datasetController.updateDataset)
  .patch(datasetController.updateDataset)
  .delete(datasetController.deleteDataset);

module.exports = router;
