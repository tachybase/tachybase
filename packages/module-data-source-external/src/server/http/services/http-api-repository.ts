import _ from 'lodash';

import { HttpCollection } from './http-collection';

export class HttpApiRepository {
  constructor(public collection: HttpCollection) {}
  async count(options) {
    const { transformedResponse } = await this.collection.runAction('list');
    return _.get(transformedResponse, 'meta.count', transformedResponse.data.length);
  }
  async find(options) {
    const { transformedResponse } = await this.collection.runAction('list');
    return transformedResponse.data;
  }
  async findAndCount(options = {}) {
    const templateContext = this.buildTemplateContextFromRequestContext(options.context, {
      filter: options.filter,
      sort: options.sort,
    });
    const { transformedResponse } = await this.collection.runAction('list', templateContext);
    return [transformedResponse.data, _.get(transformedResponse, 'meta.count', transformedResponse.length)];
  }
  async findOne(options) {
    const templateContext = this.buildTemplateContextFromRequestContext(options.context, {
      filter: options.filter,
      sort: options.sort,
      filterByTk: options.filterByTk,
    });
    const { transformedResponse } = await this.collection.runAction('get', templateContext);
    return transformedResponse.data;
  }
  async create(options) {
    options.values = this.handleValuesWithWhiteListAndBlackList(options);
    const templateContext = this.buildTemplateContextFromRequestContext(options.context, {
      values: options.values,
    });
    const { transformedResponse } = await this.collection.runAction('create', templateContext);
    return transformedResponse.data;
  }
  async update(options) {
    options.values = this.handleValuesWithWhiteListAndBlackList(options);
    const templateContext = this.buildTemplateContextFromRequestContext(options.context, {
      filter: options.filter,
      sort: options.sort,
      filterByTk: options.filterByTk,
      values: options.values,
    });
    const { transformedResponse } = await this.collection.runAction('update', templateContext);
    return transformedResponse.data;
  }
  async destroy(options) {
    const templateContext = this.buildTemplateContextFromRequestContext(options.context, {
      filter: options.filter,
      sort: options.sort,
      filterByTk: options.filterByTk,
    });
    const { transformedResponse } = await this.collection.runAction('destroy', templateContext);
    return transformedResponse.data;
  }
  buildTemplateContextFromRequestContext(ctx, others = {}) {
    const templateContext = { ...others };
    if (_.get(ctx, 'action.params')) {
      _.set(templateContext, 'request.params', ctx.action.params);
      if (ctx.action.params.page) {
        _.set(templateContext, 'page', ctx.action.params.page);
      }
      if (ctx.action.params.pageSize) {
        _.set(templateContext, 'pageSize', ctx.action.params.pageSize);
      }
    }
    if (_.get(ctx, 'request.headers')) {
      _.set(templateContext, 'request.headers', ctx.request.headers);
    }
    return templateContext;
  }
  handleValuesWithWhiteListAndBlackList(options) {
    const { whiteList, blackList } = options;
    let { values } = options;
    if (!values) {
      return values;
    }
    if (whiteList && whiteList.length) {
      values = _.pick(values, whiteList);
    }
    if (blackList && blackList.length) {
      values = _.omit(values, blackList);
    }
    return values;
  }
}
