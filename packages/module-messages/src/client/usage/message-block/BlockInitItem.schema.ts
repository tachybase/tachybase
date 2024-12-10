import { uid } from '@tachybase/utils/client';

export const getSchemaBlockInitItem = (params) => {
  const {
    item: { collection, action, params: paramsItem },
  } = params;
  const id = uid();

  return {
    name: id,
    type: 'void',
    'x-uid': id,
    'x-decorator': 'Messages-ProviderCollectionMessages',
    'x-decorator-props': {
      collection,
      params: paramsItem,
      action: action || 'list',
    },
    'x-component': 'CardItem',
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': 'blockSettings:table',
    properties: {
      block: {
        type: 'void',
        'x-component': 'Messages-ViewTableMessages',
      },
    },
  };
};
