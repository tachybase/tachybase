import { ISchema, Schema } from '@formily/react';
import { uid } from '@formily/shared';
import {
  FieldOptions,
  isAssocField,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  __UNSAFE__,
  SchemaInitializerItemType,
} from '@nocobase/client';
import _ from 'lodash';
const { removeGridFormItem } = __UNSAFE__;

// 筛选表单相关
export const useFilterAssociatedFormItemInitializerFields = () => {
  const { name, fields } = useCollection_deprecated();
  const { getCollectionFields } = useCollectionManager_deprecated();
  const interfaces = ['m2o', 'obo'];
  const groups = fields
    ?.filter((field) => {
      return interfaces.includes(field.interface);
    })
    ?.map((field) => getItem(field, field.name, name, getCollectionFields, []));
  return groups;
};

const getItem = (
  field: FieldOptions,
  schemaName: string,
  collectionName: string,
  getCollectionFields,
  processedCollections: string[],
) => {
  if (field.interface === 'm2o' || field.interface === 'obo') {
    if (processedCollections.includes(field.target)) return null;

    const subFields = getCollectionFields(field.target);

    const extendedChildren = [];
    const children = subFields
      .map((subField) =>
        // 使用 | 分隔，是为了防止 form.values 中出现 { a: { b: 1 } } 的情况
        // 使用 | 分隔后，form.values 中会出现 { 'a|b': 1 } 的情况，这种情况下
        // 就可以知道该字段是一个关系字段中的输入框，进而特殊处理
        {
          if (isAssocField(subField)) {
            const subFieldSchema = {
              type: 'string',
              name: `${schemaName}.${subField.name}`,
              required: false,
              'x-designer': 'FormItem.FilterFormDesigner',
              'x-component': 'CollectionField',
              'x-decorator': 'FormItem',
              'x-collection-field': `${collectionName}.${schemaName}.${subField.name}`,
              'x-component-props': subField.uiSchema?.['x-component-props'],
            };
            const subFieldItem = {
              name: subField.uiSchema?.title || subField.name,
              type: 'item',
              title: subField.uiSchema?.title || subField.name,
              Component: 'CollectionFieldInitializer',
              remove: removeGridFormItem,
              schema: subFieldSchema,
            } as SchemaInitializerItemType;
            extendedChildren.push(subFieldItem);
          }
          return getItem(subField, `${schemaName}.${subField.name}`, collectionName, getCollectionFields, [
            ...processedCollections,
            field.target,
          ]);
        },
      )
      .filter(Boolean);

    return {
      type: 'subMenu',
      title: field.uiSchema?.title,
      children: _.unionBy([...extendedChildren, ...children], 'title'),
    } as SchemaInitializerItemType;
  }

  if (isAssocField(field)) return null;

  const schema = {
    type: 'string',
    name: schemaName,
    'x-designer': 'FormItem.FilterFormDesigner',
    'x-designer-props': {
      // 在 useOperatorList 中使用，用于获取对应的操作符列表
      interface: field.interface,
    },
    'x-component': 'CollectionField',
    'x-read-pretty': false,
    'x-decorator': 'FormItem',
    'x-collection-field': `${collectionName}.${schemaName}`,
  };

  return {
    name: field.uiSchema?.title || field.name,
    type: 'item',
    title: field.uiSchema?.title || field.name,
    Component: 'CollectionFieldInitializer',
    remove: removeGridFormItem,
    schema,
  } as SchemaInitializerItemType;
};

export const createCalendarBlockSchema = (options) => {
  const { collection, resource, fieldNames, ...others } = options;
  const schema: ISchema = {
    type: 'void',
    'x-acl-action': `${resource || collection}:list`,
    'x-decorator': 'CalendarBlockProvider',
    'x-decorator-props': {
      collection: collection,
      resource: resource || collection,
      action: 'list',
      fieldNames: {
        id: 'id',
        ...fieldNames,
      },
      params: {
        paginate: false,
      },
      ...others,
    },
    'x-designer': 'CalendarV2.Designer',
    'x-component': 'CardItem',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'CalendarV2',
        'x-component-props': {
          useProps: '{{ useCalendarBlockProps }}',
        },
        properties: {
          toolBar: {
            type: 'void',
            'x-component': 'CalendarV2.ActionBar',
            'x-component-props': {
              style: {
                marginBottom: 24,
              },
            },
            'x-initializer': 'CalendarActionInitializers',
            properties: {},
          },
          event: {
            type: 'void',
            'x-component': 'CalendarV2.Event',
            properties: {
              drawer: {
                type: 'void',
                'x-component': 'Action.Drawer',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
                title: '{{ t("View record") }}',
                properties: {
                  tabs: {
                    type: 'void',
                    'x-component': 'Tabs',
                    'x-component-props': {},
                    'x-initializer': 'TabPaneInitializers',
                    'x-initializer-props': {
                      gridInitializer: 'RecordBlockInitializers',
                    },
                    properties: {
                      tab1: {
                        type: 'void',
                        title: '{{t("Details")}}',
                        'x-component': 'Tabs.TabPane',
                        'x-designer': 'Tabs.Designer',
                        'x-component-props': {},
                        properties: {
                          grid: {
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer-props': {
                              actionInitializers: 'CalendarFormActionInitializers',
                            },
                            'x-initializer': 'RecordBlockInitializers',
                            properties: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  Object.values(fieldNames).forEach((fieldName) => {
    if (Array.isArray(fieldName)) {
      schema.properties[fieldName[0]] = {
        'x-collection-field': collection + '.' + fieldName[0],
      };
    } else if (typeof fieldName === 'string') {
      schema.properties[fieldName] = {
        'x-collection-field': collection + '.' + fieldName,
      };
    }
  });
  return schema;
};

const findSchema = (schema: Schema, key: string, action: string) => {
  if (!Schema.isSchemaInstance(schema)) return null;
  return schema.reduceProperties((buf, s) => {
    if (s[key] === action) {
      return s;
    }
    if (s['x-component'] !== 'Action.Container') {
      const c = findSchema(s, key, action);
      if (c) {
        return c;
      }
    }

    return buf;
  });
};

export const createFormBlockSchema = (options) => {
  const {
    formItemInitializers = 'FormItemInitializers',
    actionInitializers = 'FormActionInitializers',
    collection,
    resource,
    association,
    action,
    actions = {},
    'x-designer': designer = 'FormV2.Designer',
    template,
    title,
    ...others
  } = options;

  const resourceName = resource || association || collection;
  const schema: ISchema = {
    type: 'void',
    'x-acl-action-props': {
      skipScopeCheck: !action,
    },
    'x-acl-action': action ? `${resourceName}:update` : `${resourceName}:create`,
    'x-decorator': 'FormBlockProvider',
    'x-decorator-props': {
      ...others,
      action,
      resource: resourceName,
      collection,
      association,
      // action: 'get',
      // useParams: '{{ useParamsFromRecord }}',
    },
    'x-designer': designer,
    'x-component': 'CardItem',
    'x-component-props': {
      title,
    },
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'FormV2',
        'x-component-props': {
          useProps: '{{ useFormBlockProps }}',
        },
        properties: {
          actions: {
            type: 'void',
            'x-initializer': actionInitializers,
            'x-component': 'ActionBar',
            'x-component-props': {
              style: {
                marginBottom: 'var(--nb-spacing)',
              },
            },
            properties: actions,
          },
          grid: template || {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': formItemInitializers,
            properties: {},
          },
        },
      },
    },
  };
  return schema;
};
