import { ISchema } from '@tachybase/schema';
import { uid } from '@tachybase/utils/client';

export const getSchemaGroupBlock = (options) => {
  const { collection, groupField } = options;
  const sumItem = [];
  collection?.fields.forEach((value) => {
    if (value.interface === 'number' || (value.interface === 'formula' && value.dataType === 'double')) {
      sumItem.push({
        label: value.uiSchema.title,
        field: [value.name],
        aggregation: 'sum',
        display: true,
      });
    }
  });
  const schema: ISchema = {
    title: collection.title,
    type: 'void',
    'x-acl-action': `${collection.name}:list`,
    'x-toolbar': 'GroupBlockToolbar',
    'x-settings': 'groupBlockSettings',
    'x-decorator': 'GroupBlockProvider',
    'x-decorator-props': {
      collection: collection.name,
      resourceParams: {
        resource_deprecated: 'charts',
        action: 'query',
        groupField,
      },
      params: {
        collection: collection.name,
        measures: sumItem,
      },
    },
    'x-component': 'CardItem',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'GroupBlock',
      },
    },
  };

  if (!sumItem.length) {
    delete schema['x-decorator-props']['resource_deprecated'];
  }
  if (collection.template === 'view' && !sumItem.length) {
    delete schema['x-decorator-props']['action'];
    delete schema['x-decorator-props']['groupField'];
  }
  return schema;
};
