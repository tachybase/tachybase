import _ from 'lodash';

interface ParamsType {
  summaryConfig: Array<string>;
  data: object;
}

export function getSummaryString(params: ParamsType): string {
  const { summaryConfig = [], data } = params;
  const result = summaryConfig
    .map((key) => {
      const value = _.get(data, key);
      // XXX: 丑陋的实现, 不应该依赖具体字段, 应该从 summaryConfig, 拿到的就是最终的值, 走通优先
      if (Object.prototype.toString.call(value) === '[object Object]') {
        return _.get(value, 'name');
      }
      return _.get(data, key);
    })
    .join(',');
  return result;
}
