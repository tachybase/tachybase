import _ from 'lodash';

interface ParamsType {
  summaryConfig: Array<string>;
  data: object;
}

export function getSummary(params: ParamsType): object {
  const { summaryConfig = [], data } = params;

  const result = summaryConfig.reduce((summary, key) => {
    const value = _.get(data, key);
    return {
      ...summary,
      [key]: value,
    };
  }, {});

  return result;
}
