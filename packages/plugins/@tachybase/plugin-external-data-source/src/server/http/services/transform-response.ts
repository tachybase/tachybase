import { filterMatch } from '@tachybase/database';

import _ from 'lodash';

const middlewares = {
  list: [
    function validateListActionTransformedResponse(options) {
      const { transformedResponse } = options;
      const dataItem = _.get(transformedResponse, 'data');
      if (!Array.isArray(dataItem)) {
        throw new Error(
          `The transformed response for the list action should be an array. got ${getValueType(dataItem)}`,
        );
      }
      if (!dataItem.every((item) => _.isPlainObject(item))) {
        throw new Error('Every item in the transformed response should be an object');
      }
    },
    function handleFilter(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.filter'])) {
        return;
      }
      const filter = _.get(options.templateContext, 'request.params.filter') || {};
      const { data } = options.transformedResponse;
      options.transformedResponse.data = data.filter((item) => {
        return filterMatch(item, filter);
      });
    },
    function handleSort(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.sort'])) {
        return;
      }
      const sort = _.get(options.templateContext, 'request.params.sort') || [];
      if (sort.length === 0) {
        return;
      }
      const { data } = options.transformedResponse;
      options.transformedResponse.data = data.sort((a, b) => {
        for (const sortItem of sort) {
          const isDesc = sortItem.startsWith('-');
          const field = isDesc ? sortItem.slice(1) : sortItem;
          if (a[field] > b[field]) {
            return isDesc ? -1 : 1;
          }
          if (a[field] < b[field]) {
            return isDesc ? 1 : -1;
          }
        }
        return 0;
      });
    },
    function handleFullList(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.page'])) {
        return;
      }
      const page = parseInt(_.get(options.templateContext, 'request.params.page', 1));
      const pageSize = parseInt(_.get(options.templateContext, 'request.params.pageSize', 20));
      const { data } = options.transformedResponse;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      options.transformedResponse.data = data.slice(start, end);
      _.set(options.transformedResponse, 'meta.count', data.length);
      _.set(options.transformedResponse, 'meta.page', page);
      _.set(options.transformedResponse, 'meta.pageSize', pageSize);
      _.set(options.transformedResponse, 'meta.totalPage', Math.ceil(data.length / pageSize));
    },
    function handleFields(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.fields'])) {
        return;
      }
      const fields = _.get(options.templateContext, 'request.params.fields') || [];
      if (fields.length === 0) {
        return;
      }
      const { data } = options.transformedResponse;
      options.transformedResponse.data = data.map((item) => {
        return _.pick(item, fields);
      });
    },
    function handleExpect(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.expect'])) {
        return;
      }
      const expect = _.get(options.templateContext, 'request.params.expect') || [];
      if (expect.length === 0) {
        return;
      }
      const { data } = options.transformedResponse;
      options.transformedResponse.data = data.map((item) => {
        return _.omit(item, expect);
      });
    },
  ],
  get: [
    function validateGetActionTransformedResponse(options) {
      const { transformedResponse } = options;
      const dataItem = _.get(transformedResponse, 'data');
      if (!_.isPlainObject(dataItem)) {
        throw new Error(
          `The transformed response for the get action should be an object. got ${getValueType(dataItem)}`,
        );
      }
    },
    function handleFields2(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.fields'])) {
        return;
      }
      const fields = _.get(options.templateContext, 'request.params.fields') || [];
      if (fields.length === 0) {
        return;
      }
      const { data } = options.transformedResponse;
      options.transformedResponse.data = _.pick(data, fields);
    },
    function handleExpect2(options) {
      if (checkVariablesAreUsed(options.actionOptions, ['request.params.expect'])) {
        return;
      }
      const expect = _.get(options.templateContext, 'request.params.expect') || [];
      if (expect.length === 0) {
        return;
      }
      const { data } = options.transformedResponse;
      options.transformedResponse.data = _.omit(data, expect);
    },
  ],
  create: [],
  update: [],
  destroy: [],
};
export function transformResponseThroughMiddleware(options) {
  const { actionOptions } = options;
  const { type } = actionOptions;
  const actionMiddlewares = middlewares[type] || [];
  actionMiddlewares.forEach((middleware) => {
    middleware(options);
  });
}
function checkVariablesAreUsed(options, variables) {
  const template = JSON.stringify(options);
  return variables.every((variable) => template.includes(`{{${variable}}}`));
}
function getValueType(value) {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (_.isPlainObject(value)) {
    return 'object';
  }
  return typeof value;
}
