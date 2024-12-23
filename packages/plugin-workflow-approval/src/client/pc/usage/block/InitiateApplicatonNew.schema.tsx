import { FeatureList } from './FeatureList.component';
import { ProviderFeatureList } from './FeatureList.provider';

export const getSchemaApplicationNew = (params) => {
  const { collection, action, params: requestParams } = params;

  return {
    type: 'void',
    'x-decorator': ProviderFeatureList,
    'x-decorator-props': {
      collection,
      action,
      params: requestParams,
    },
    'x-component': FeatureList,
    name: 'initiateApplicationNew',
  };
};
