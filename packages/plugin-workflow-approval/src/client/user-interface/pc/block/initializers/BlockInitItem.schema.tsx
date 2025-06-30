import { uid } from '@tachybase/utils/client';

export const getRemoteSchemaBlockInitItem = (params) => {
  const { item: itemSchema } = params;
  const id = uid();
  const {
    collection,
    params: paramsItem,
    action,
    ['x-toolbar']: xToolbar,
    ['x-settings']: xSettings,
    ['x-decorator']: xDecorator,
    ['x-decorator-props']: xDecoratorProps,
    ['x-component']: xComponent,
    ['x-component-props']: xComponentProps,
  } = itemSchema;
  return {
    type: 'void',
    name: id,
    'x-uid': id,
    'x-decorator': xDecorator || 'Approval-ProviderBlockInitItem',
    'x-decorator-props': {
      collection,
      params: paramsItem,
      action: action || 'listCentralized',
      ...xDecoratorProps,
    },
    'x-component': 'CardItem',
    'x-designer': 'TableBlockDesigner',
    'x-toolbar': xToolbar,
    'x-settings': xSettings,
    properties: {
      block: {
        type: 'void',
        'x-component': xComponent,
        'x-component-props': {
          collection,
          action,
          ...xComponentProps,
        },
      },
    },
  };
};
