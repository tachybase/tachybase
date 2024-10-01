export const paramsMap = {
  list: ['page', 'pageSize', 'filter', 'sort', 'appends', 'fields', 'except'],
  get: ['filterByTk', 'filter', 'sort', 'appends', 'fields', 'except'],
  create: ['whiteList', 'blacklist', 'body'],
  update: ['filterByTk', 'filter', 'whiteList', 'blacklist', 'body'],
  destroy: ['filterByTk', 'filter'],
};
