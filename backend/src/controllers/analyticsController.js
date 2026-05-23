const Dataset = require('../models/dataset');
const catchAsync = require('../utils/catchAsync');

// Helper to execute aggregation pipeline and return standard response
const runPipeline = async (res, pipeline, message) => {
  const result = await Dataset.aggregate(pipeline);
  res.status(200).json({
    success: true,
    message,
    results: result.length,
    data: result
  });
};

// 1. Analyze datasets by type
exports.getTypeAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$metadata.type",
        count: { $sum: 1 },
        avgOutputLength: { $avg: { $strLenCP: { $ifNull: ["$output", ""] } } }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'Dataset type analytics computed successfully');
});

// 2. Analyze repositories distribution
exports.getRepoAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$metadata.repo_name",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 20 } // Limit to top 20 repositories
  ];
  await runPipeline(res, pipeline, 'Repository distribution analytics computed successfully');
});

// 3. Analyze source type distribution
exports.getSourceAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$metadata.source_type",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'Source type distribution analytics computed successfully');
});

// 4. Analyze framework usage (PyTorch vs TensorFlow)
exports.getFrameworkAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        framework: {
          $cond: {
            if: { $regexMatch: { input: { $ifNull: ["$metadata.repo_name", ""] }, regex: /pytorch|torch/i } },
            then: "PyTorch",
            else: {
              $cond: {
                if: { $regexMatch: { input: { $ifNull: ["$metadata.repo_name", ""] }, regex: /tensorflow|keras/i } },
                then: "TensorFlow",
                else: "Other / General"
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$framework",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'Framework usage analytics computed successfully');
});

// 5. Analyze programming languages (based on file paths)
exports.getLanguageAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        language: {
          $cond: {
            if: { $regexMatch: { input: { $ifNull: ["$metadata.file_path", ""] }, regex: /\.py$/i } },
            then: "Python",
            else: {
              $cond: {
                if: { $regexMatch: { input: { $ifNull: ["$metadata.file_path", ""] }, regex: /\.md$/i } },
                then: "Markdown",
                else: {
                  $cond: {
                    if: { $regexMatch: { input: { $ifNull: ["$metadata.file_path", ""] }, regex: /\.rst$/i } },
                    then: "ReStructuredText",
                    else: "Plain Text / Other"
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: "$language",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'Programming language analytics computed successfully');
});

// 6. Analyze code elements (functions vs classes)
exports.getCodeAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { 'metadata.code_element': { $exists: true }, isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$metadata.code_element",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'Code element analytics computed successfully');
});

// 7. Analyze document formats
exports.getDocAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { 'metadata.doc_type': { $exists: true }, isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$metadata.doc_type",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'Documentation format analytics computed successfully');
});

// 8. Analyze README files ratio
exports.getReadmeAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$metadata.is_readme",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ];
  await runPipeline(res, pipeline, 'README filter analytics computed successfully');
});

// 9. Analyze Machine Learning datasets
exports.getMLAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        isDeleted: { $ne: true },
        $or: [
          { 'metadata.repo_name': /machine-learning|ml|classification|regression|scikit|sklearn|pandas|numpy/i },
          { instruction: /machine learning|classification|regression|dataset|supervised|unsupervised/i }
        ]
      }
    },
    {
      $group: {
        _id: "$metadata.repo_name",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];
  await runPipeline(res, pipeline, 'Machine Learning specific analytics computed successfully');
});

// 10. Analyze AI datasets
exports.getAIAnalysis = catchAsync(async (req, res, next) => {
  const pipeline = [
    {
      $match: {
        isDeleted: { $ne: true },
        $or: [
          { 'metadata.repo_name': /transformers|huggingface|llm|gpt|openai|llama|deepseek|keras|pytorch|tensorflow/i },
          { instruction: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i }
        ]
      }
    },
    {
      $group: {
        _id: "$metadata.repo_name",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ];
  await runPipeline(res, pipeline, 'AI specific analytics computed successfully');
});
