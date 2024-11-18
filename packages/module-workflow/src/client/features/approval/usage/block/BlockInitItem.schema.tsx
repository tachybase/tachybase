import { uid } from '@tachybase/utils/client';

export const getSchemaBlockInitItem = (params) => {
  const { item: itemSchema } = params;
  const id = uid();
  const {
    collection,
    params: paramsItem,
    ['x-component']: xcomponent,
    action,
    ['x-decorator']: decorator,
    ['x-toolbar']: toolbar,
    ['x-settings']: settings,
  } = itemSchema;

  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-decorator': decorator || 'Approval:ProviderBlockInitItem',
    'x-decorator-props': {
      collection,
      params: paramsItem,
      action: action || 'listCentralized',
    },
    'x-component': 'CardItem',
    'x-designer': 'TableBlockDesigner',
    'x-toolbar': toolbar,
    'x-settings': settings,
    properties: {
      block: {
        type: 'void',
        'x-component': xcomponent,
      },
    },
  };
};
