import { SchemaInitializerItemType } from '@nocobase/client';

interface OptionsType {
  label: string;
  field: any;
  collection: any;
  isMobile: boolean;
  isCanBeOptional: boolean;
  isCanBeRelated: boolean;
}

export function createSchemaImageSearchItem(options: OptionsType): SchemaInitializerItemType {
  const { field, isMobile, label, isCanBeOptional, isCanBeRelated, collection } = options;
  const { key, name, uiSchema, interface: _interface } = field;
  const title = uiSchema?.title;
  const indexOfUseProps = [isCanBeOptional, isCanBeRelated].indexOf(true);
  return {
    name: key,
    title,
    Component: 'ImageSearchItemIntializer',
    schema: {
      name: `${name}-choice`,
      fieldName: name,
      title,
      type: 'void',
      'x-toolbar': 'ImageSearchItemToolbar',
      'x-settings': 'fieldSettings:component:ImageSearchItem',
      'x-component': 'ImageSearchItemView',
      'x-component-props': {
        fieldNames: {
          label,
        },
        interface: _interface,
        collectionName: collection?.name,
        correlation: name,
      },
      'x-use-component-props': ['useTabSearchFieldItemProps', 'useTabSearchFieldItemRelatedProps'][indexOfUseProps],
      properties: {},
    },
  };
}
