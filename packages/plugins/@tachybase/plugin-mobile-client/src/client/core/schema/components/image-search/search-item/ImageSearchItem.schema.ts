import { SchemaInitializerItemType } from '@tachybase/client';

interface OptionsType {
  label?: string;
  field?: any;
  collection?: any;
  isMobile?: boolean;
  isCanBeOptional?: boolean;
  isCanBeRelated?: boolean;
}

export function createSchemaImageSearchItem(options: OptionsType): SchemaInitializerItemType {
  const { field, isMobile, label, isCanBeOptional, isCanBeRelated, collection } = options;
  const { key, name, uiSchema, interface: _interface } = field;
  const title = uiSchema?.title;
  const indexOfUseProps = [isCanBeOptional, isCanBeRelated].indexOf(true);
  return {
    name: key,
    title: title,
    Component: 'ImageSearchItemIntializer',
    schema: {
      name: `${name}-choice`,
      fieldName: name,
      title: title,
      type: 'void',
      'x-toolbar': 'ImageSearchItemToolbar',
      'x-settings': 'fieldSettings:component:ImageSearchItem',
      'x-component': 'ImageSearchItemView',
      'x-component-props': {
        fieldNames: {
          label,
          // 固定字段, 用于取数据表对外展示的图片字段
          imageShow: 'image_show',
        },
        interface: _interface,
        collectionName: collection?.name,
        correlation: name,
      },
      'x-use-component-props': ['usePropsOptionalImageSearchItemField', 'usePropsRelatedImageSearchItemField'][
        indexOfUseProps
      ],
      properties: {},
    },
  };
}
