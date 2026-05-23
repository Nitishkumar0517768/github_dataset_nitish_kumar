/**
 * Reusable Pagination Utility (Good to Have 11)
 * Extracts pagination parameters and calculates offsets.
 */
const getPagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 100;
  
  // Guard against invalid pagination (Error Handling Route 200)
  const sanitizedPage = page > 0 ? page : 1;
  const sanitizedLimit = limit > 0 ? (limit <= 1000 ? limit : 100) : 100;

  const skip = (sanitizedPage - 1) * sanitizedLimit;

  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    skip
  };
};

module.exports = getPagination;
