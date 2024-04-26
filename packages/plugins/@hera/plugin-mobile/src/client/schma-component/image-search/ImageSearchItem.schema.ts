import { SchemaInitializerItemType } from '@nocobase/client';

interface OptionsType {
  label: string;
  field: any;
  collection: any;
  isMobile: boolean;
  isCanBeOptional: boolean;
}

export const createSchemaImageSearchItem = (options: OptionsType): SchemaInitializerItemType => {
  const { field, isMobile, label, isCanBeOptional, collection } = options;
  const { key, name, uiSchema, interface: _interface } = field;
  const title = uiSchema?.title;
  return {
    name: key,
    title,
    Component: 'TabSearchFieldSchemaInitializerGadget',
    schema: {
      name: 'choices',
      fieldName: name,
      title,
      type: 'void',
      'x-toolbar': 'CollapseItemSchemaToolbar',
      'x-settings': 'fieldSettings:TabSearchItem',
      'x-component': isMobile ? 'TabSearchFieldMItem' : 'TabSearchFieldItem',
      'x-use-component-props': isCanBeOptional ? 'useTabSearchFieldItemProps' : 'useTabSearchFieldItemRelatedProps',
      'x-component-props': {
        fieldNames: {
          label,
        },
        interface: _interface,
        collectionName: collection?.name,
        correlation: name,
      },
      properties: {},
    },
  };
};
