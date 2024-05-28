import {
  AssociatedFields,
  CompatibleSchemaInitializer,
  formItemInitializers_deprecated,
  gridRowColWrap,
  ParentCollectionFields,
  SchemaInitializerItemType,
  useActionContext,
  useCollection_deprecated,
  useCollectionManager_deprecated,
} from '@tachybase/client';
import { Schema, useForm } from '@tachybase/schema';

import { useIsMobile } from '../../hooks';
import { canMobileField } from './CustomComponent';

export const useFormItemInitializerFields = (options?: any) => {
  const { name, currentFields } = useCollection_deprecated();
  const isMobile = useIsMobile();
  const { getInterface, getCollection } = useCollectionManager_deprecated();
  const form = useForm();
  const { readPretty = form.readPretty, block = 'Form' } = options || {};
  const { fieldSchema } = useActionContext();
  const action = fieldSchema?.['x-action'];

  return currentFields
    ?.filter((field) => field?.interface && !field?.isForeignKey && !field?.treeChildren)
    ?.map((field) => {
      const interfaceConfig = getInterface(field.interface);
      const targetCollection = getCollection(field.target);
      const isFileCollection = field?.target && getCollection(field?.target)?.template === 'file';
      const isAssociationField = targetCollection;
      const fieldNames = field?.uiSchema['x-component-props']?.['fieldNames'];
      const isMobileComponent = canMobileField(field.uiSchema['x-component']);
      const schema = {
        type: 'string',
        name: field.name,
        'x-toolbar': 'FormItemSchemaToolbar',
        'x-settings': 'fieldSettings:FormItem',
        'x-component': 'CollectionField',
        'x-decorator': 'FormItem',
        'x-collection-field': `${name}.${field.name}`,
        'x-component-props': isFileCollection
          ? {
              fieldNames: {
                label: 'preview',
                value: 'id',
              },
            }
          : isAssociationField && fieldNames
            ? {
                fieldNames: { ...fieldNames, label: targetCollection?.titleField || fieldNames.label },
              }
            : {},
        'x-read-pretty': field?.uiSchema?.['x-read-pretty'],
      };
      if (isMobile && isMobileComponent) {
        schema['x-component-props']['component'] = isMobileComponent;
      }
      const resultItem = {
        type: 'item',
        name: field.name,
        title: field?.uiSchema?.title || field.name,
        Component: 'CollectionFieldInitializer',
        remove: removeGridFormItem,
        schemaInitialize: (s) => {
          interfaceConfig?.schemaInitialize?.(s, {
            field,
            block,
            readPretty,
            action,
            targetCollection,
          });
        },
        schema,
      } as SchemaInitializerItemType;
      if (block == 'Kanban') {
        resultItem['find'] = (schema: Schema, key: string, action: string) => {
          const s = findSchema(schema, 'x-component', block);
          return findSchema(s, key, action);
        };
      }

      return resultItem;
    });
};

export const MobileFormItemInitializers = new CompatibleSchemaInitializer(
  {
    name: 'form:configureFields',
    wrap: gridRowColWrap,
    icon: 'SettingOutlined',
    title: '{{t("Configure fields")}}',
    items: [
      {
        type: 'itemGroup',
        name: 'displayFields',
        title: '{{t("Display fields")}}',
        useChildren: useFormItemInitializerFields,
      },
      {
        name: 'parentCollectionFields',
        Component: ParentCollectionFields,
      },
      {
        name: 'associationFields',
        Component: AssociatedFields,
      },
      {
        name: 'divider',
        type: 'divider',
      },
      {
        name: 'addText',
        title: '{{t("Add text")}}',
        Component: 'MarkdownFormItemInitializer',
      },
    ],
  },
  formItemInitializers_deprecated,
);

export const removeGridFormItem = (schema, cb) => {
  cb(schema, {
    removeParentsIfNoChildren: true,
    breakRemoveOn: {
      'x-component': 'Grid',
    },
  });
};

const findSchema = (schema: Schema, key: string, action: string) => {
  if (!Schema.isSchemaInstance(schema)) return null;
  return schema.reduceProperties((buf, s) => {
    if (s[key] === action) {
      return s;
    }
    if (s['x-component'] !== 'Action.Container' && s['x-component'] !== 'AssociationField.Viewer') {
      const c = findSchema(s, key, action);
      if (c) {
        return c;
      }
    }

    return buf;
  });
};
