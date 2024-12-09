import { ISchema } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

export const createGridCardBlockSchema = (options, componentName) => {
  const {
    formItemInitializers = 'ReadPrettyFormItemInitializers',
    actionInitializers = 'GridCardActionInitializers',
    itemActionInitializers = 'GridCardItemActionInitializers',
    collection,
    association,
    resource,
    template,
    dataSource,
    settings,
    value,
    childrenSettings,
    ...others
  } = options;
  const resourceName = resource || association || collection;
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resourceName}:view`,
    'x-decorator': 'GridCard.Decorator',
    'x-decorator-props': {
      resource: resourceName,
      collection,
      association,
      dataSource,
      readPretty: true,
      action: 'list',
      params: {
        pageSize: 12,
      },
      runWhenParamsChanged: true,
      ...others,
    },
    'x-component': 'BlockItem',
    'x-component-props': {
      useProps: '{{ useGridCardBlockItemProps }}',
    },
    'x-toolbar': 'BlockSchemaToolbar',
    'x-settings': settings,
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': componentName,
        'x-settings': childrenSettings,
        'x-component-props': {
          resourceName,
          fieldName: {
            value,
          },
        },
      },
    },
  };
  return schema;
};
