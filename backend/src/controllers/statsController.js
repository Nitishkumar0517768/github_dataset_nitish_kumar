const Dataset = require('../models/dataset');
const catchAsync = require('../utils/catchAsync');

// Helper to return standardized stats response
const sendStat = (res, count, label) => {
  res.status(200).json({
    success: true,
    label,
    count
  });
};

// 1. Count total datasets (Estimated document count for maximum speed)
exports.getTotalCount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({ isDeleted: { $ne: true } });
  sendStat(res, count, 'Total Datasets');
});

// 2. Count function datasets
exports.getFunctionsCount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.type': { $in: ['function', 'function_implementation'] } },
      { 'metadata.code_element': 'function' }
    ]
  });
  sendStat(res, count, 'Function Datasets');
});

// 3. Count class datasets
exports.getClassesCount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.type': { $in: ['class', 'class_implementation'] } },
      { 'metadata.code_element': 'class' }
    ]
  });
  sendStat(res, count, 'Class Datasets');
});

// 4. Count documentation datasets
exports.getDocumentationCount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.type': 'documentation' },
      { 'metadata.doc_type': { $exists: true } }
    ]
  });
  sendStat(res, count, 'Documentation Datasets');
});

// 5. Count README datasets
exports.getReadmeCount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({
    'metadata.is_readme': true,
    isDeleted: { $ne: true }
  });
  sendStat(res, count, 'README-based Datasets');
});

// 6. Count unique repositories
exports.getReposCount = catchAsync(async (req, res, next) => {
  const repos = await Dataset.distinct('metadata.repo_name', { isDeleted: { $ne: true } });
  sendStat(res, repos.length, 'Unique Repositories');
});

// 7. Count unique programming languages (checks extensions)
exports.getLanguagesCount = catchAsync(async (req, res, next) => {
  const files = await Dataset.distinct('metadata.file_path', { isDeleted: { $ne: true } });
  const extensions = new Set();
  files.forEach(fp => {
    if (fp) {
      const idx = fp.lastIndexOf('.');
      if (idx !== -1) {
        extensions.add(fp.substring(idx + 1).toLowerCase());
      }
    }
  });
  sendStat(res, extensions.size || 1, 'Unique Programming Languages');
});

// 8. Count unique frameworks
exports.getFrameworksCount = catchAsync(async (req, res, next) => {
  const repos = await Dataset.distinct('metadata.repo_name', {
    'metadata.repo_name': /pytorch|tensorflow|keras|torch|scikit|sklearn|jax/i,
    isDeleted: { $ne: true }
  });
  sendStat(res, repos.length, 'Unique Frameworks');
});

// 9. Count GitHub source datasets
exports.getGithubCount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({
    'metadata.source_type': 'github_repository',
    isDeleted: { $ne: true }
  });
  sendStat(res, count, 'GitHub Repository Datasets');
});

// 10. Count AI datasets
exports.getAICount = catchAsync(async (req, res, next) => {
  const count = await Dataset.countDocuments({
    isDeleted: { $ne: true },
    $or: [
      { 'metadata.repo_name': /transformers|huggingface|llm|gpt|openai|llama|deepseek|keras|pytorch|tensorflow/i },
      { instruction: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i }
    ]
  });
  sendStat(res, count, 'AI specific Datasets');
});

// 11. GET Advanced Analytics Data
exports.getAnalyticsData = catchAsync(async (req, res, next) => {
  // Group by metadata type
  const typeStats = await Dataset.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$metadata.type', count: { $sum: 1 } } },
    { $project: { name: { $ifNull: ['$_id', 'unknown'] }, count: 1, _id: 0 } }
  ]);

  // Group by repo name (Top 6 repos)
  const repoStats = await Dataset.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$metadata.repo_name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 },
    { $project: { name: { $ifNull: ['$_id', 'unknown'] }, count: 1, _id: 0 } }
  ]);

  // Group by source type
  const sourceStats = await Dataset.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$metadata.source_type', count: { $sum: 1 } } },
    { $project: { name: { $ifNull: ['$_id', 'unknown'] }, count: 1, _id: 0 } }
  ]);

  // Group by language (derived from file extension)
  const allFiles = await Dataset.find({ isDeleted: { $ne: true } }, 'metadata.file_path');
  const langCounts = {};
  allFiles.forEach(doc => {
    const filePath = doc.metadata?.file_path;
    if (filePath) {
      const idx = filePath.lastIndexOf('.');
      const ext = idx !== -1 ? filePath.substring(idx + 1).toLowerCase() : 'txt';
      langCounts[ext] = (langCounts[ext] || 0) + 1;
    } else {
      langCounts['unknown'] = (langCounts['unknown'] || 0) + 1;
    }
  });

  const languageStats = Object.keys(langCounts).map(key => ({
    name: key,
    count: langCounts[key]
  })).sort((a, b) => b.count - a.count).slice(0, 6);

  res.status(200).json({
    success: true,
    data: {
      typeStats,
      repoStats,
      sourceStats,
      languageStats
    }
  });
});
