const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: false,
    index: true
  },
  code_element: {
    type: String,
    required: false,
    index: true
  },
  repo_name: {
    type: String,
    required: false,
    index: true
  },
  file_path: {
    type: String,
    required: false
  },
  source_type: {
    type: String,
    required: false,
    index: true
  },
  doc_type: {
    type: String,
    required: false,
    index: true
  },
  is_readme: {
    type: Boolean,
    required: false,
    index: true
  },
  url: {
    type: String,
    required: false
  },
  source: {
    type: String,
    required: false
  }
}, { _id: false });

const datasetSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  instruction: {
    type: String,
    required: true
  },
  input: {
    type: String,
    required: false,
    default: ''
  },
  output: {
    type: String,
    required: true
  },
  metadata: {
    type: metadataSchema,
    required: true
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  }
}, {
  timestamps: true // Good to Have 7: Timestamp Tracking System
});

// Compound indexes to speed up common searches
datasetSchema.index({ 'metadata.repo_name': 1, 'metadata.type': 1 });
datasetSchema.index({ 'metadata.file_path': 1 });
datasetSchema.index({ instruction: 'text', input: 'text', output: 'text' }); // Text search index

const Dataset = mongoose.model('Dataset', datasetSchema, 'datasets');

module.exports = Dataset;
