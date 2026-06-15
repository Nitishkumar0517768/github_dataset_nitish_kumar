/**
 * Dynamic Filter Builder Utility (Good to Have 12)
 * Converts Express query parameters into Mongoose/MongoDB query filters.
 */
const buildFilters = (queryParams) => {
  const conditions = [];

  // 1. Inventory Status
  if (queryParams.isDeleted === 'true' || queryParams.deleted === 'true') {
    conditions.push({ isDeleted: true });
  } else if (queryParams.isDeleted === 'all' || queryParams.deleted === 'all') {
    // Show all records (deleted + active)
  } else {
    conditions.push({ isDeleted: { $ne: true } });
  }

  // 2. Direct Metadata Mappings
  if (queryParams.type) {
    conditions.push({ 'metadata.type': queryParams.type });
  }
  if (queryParams.repo) {
    conditions.push({ 'metadata.repo_name': new RegExp(queryParams.repo, 'i') });
  }
  if (queryParams.source) {
    conditions.push({
      $or: [
        { 'metadata.source_type': queryParams.source },
        { 'metadata.source': queryParams.source }
      ]
    });
  }
  if (queryParams.docType) {
    conditions.push({ 'metadata.doc_type': queryParams.docType });
  }
  if (queryParams.codeElement) {
    conditions.push({ 'metadata.code_element': queryParams.codeElement });
  }
  if (queryParams.isReadme) {
    conditions.push({ 'metadata.is_readme': queryParams.isReadme === 'true' });
  }

  // 3. Language Filter
  if (queryParams.language) {
    const lang = queryParams.language.toLowerCase();
    if (lang === 'python' || lang === 'py') {
      conditions.push({
        $or: [
          { 'metadata.file_path': /\.py$/i },
          { 'metadata.repo_name': /python/i }
        ]
      });
    } else if (lang === 'markdown' || lang === 'md') {
      conditions.push({ 'metadata.doc_type': 'md' });
    } else {
      const regex = new RegExp(queryParams.language, 'i');
      conditions.push({
        $or: [
          { 'metadata.file_path': regex },
          { instruction: regex },
          { output: regex }
        ]
      });
    }
  }

  // 4. Framework Filter
  if (queryParams.framework) {
    const regex = new RegExp(queryParams.framework, 'i');
    conditions.push({
      $or: [
        { 'metadata.repo_name': regex },
        { instruction: regex },
        { output: regex }
      ]
    });
  }

  // 5. Task Filter
  if (queryParams.task) {
    const regex = new RegExp(queryParams.task, 'i');
    conditions.push({
      $or: [
        { id: regex },
        { instruction: regex },
        { input: regex }
      ]
    });
  }

  // 6. Category Filter
  if (queryParams.category) {
    const cat = queryParams.category.toLowerCase();
    if (cat === 'ai') {
      conditions.push({
        $or: [
          { 'metadata.repo_name': /transformers|huggingface|llm|gpt|openai|llama|deepseek|keras|pytorch|tensorflow/i },
          { instruction: /artificial intelligence|deep learning|neural network|llm|gpt|transformer|openai|ai/i }
        ]
      });
    } else if (cat === 'ml') {
      conditions.push({
        $or: [
          { 'metadata.repo_name': /machine-learning|ml|classification|regression|scikit|sklearn|pandas|numpy/i },
          { instruction: /machine learning|classification|regression|dataset|supervised|unsupervised/i }
        ]
      });
    } else {
      const regex = new RegExp(queryParams.category, 'i');
      conditions.push({
        $or: [
          { 'metadata.type': regex },
          { 'metadata.code_element': regex },
          { instruction: regex }
        ]
      });
    }
  }

  // 7. Fuzzy Text Keyword Search
  if (queryParams.search) {
    const regex = new RegExp(queryParams.search, 'i');
    conditions.push({
      $or: [
        { id: regex },
        { instruction: regex },
        { input: regex },
        { output: regex },
        { 'metadata.repo_name': regex }
      ]
    });
  }

  const query = {};
  if (conditions.length > 0) {
    query.$and = conditions;
  }

  return query;
};

module.exports = buildFilters;
