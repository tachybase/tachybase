import { Field, ISchema, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { useCollection_deprecated, useCollectionManager_deprecated } from '../../../..//collection-manager';
import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useFormBlockContext } from '../../../../block-provider';
import { useCompile, useDesignable } from '../../../../schema-component';
import {
  EditFormulaTitleField,
  FilterCustomVariableInput,
  SchemaSettingCollection,
  SchemaSettingComponent,
  SchemaSettingsDataScope,
} from '../../../../schema-settings';

export const FilterItemCustomSettings = new SchemaSettings({
  name: 'fieldSettings:FilterFormCustomSettings',
  items: [
    {
      name: 'editFieldTitle',
      type: 'modal',
      useComponentProps() {
        const { t } = useTranslation();
        const { dn } = useDesignable();
        const fieldSchema = useFieldSchema();
        const field = useField<Field>();
        const { getCollectionJoinField } = useCollectionManager_deprecated();
        const { getField } = useCollection_deprecated();
        const collectionField =
          getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);

        return {
          title: t('Edit field title'),
          schema: {
            type: 'object',
            title: t('Edit field title'),
            properties: {
              title: {
                title: t('Field title'),
                default: field?.title,
                description: `${t('Original field title: ')}${collectionField?.uiSchema?.title}`,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {},
              },
            },
          } as ISchema,
          onSubmit({ title }) {
            if (title) {
              field.title = title;
              fieldSchema.title = title;
              dn.emit('patch', {
                schema: {
                  'x-uid': fieldSchema['x-uid'],
                  title: fieldSchema.title,
                },
              });
            }
            dn.refresh();
          },
        };
      },
    },
    {
      name: 'editDescription',
      type: 'modal',
      useComponentProps() {
        const { t } = useTranslation();
        const { dn } = useDesignable();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();

        return {
          title: t('Edit description'),
          schema: {
            type: 'object',
            title: t('Edit description'),
            properties: {
              description: {
                // title: t('Description'),
                default: field?.description,
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
                'x-component-props': {},
              },
            },
          },
          onSubmit({ description }) {
            field.description = description;
            fieldSchema.description = description;
            dn.emit('patch', {
              schema: {
                'x-uid': fieldSchema['x-uid'],
                description: fieldSchema.description,
              },
            });
            dn.refresh();
          },
        };
      },
    },
    {
      name: 'setTheDataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const fieldSchema = useFieldSchema();
        const { form } = useFormBlockContext();
        const field = useField();
        const { dn } = useDesignable();
        const fieldName = fieldSchema['name'] as string;
        const name = fieldName.includes('__custom') ? fieldSchema['collectionName'] : fieldName;
        return {
          collectionName: name,
          defaultFilter: fieldSchema?.['x-component-props']?.params?.filter || {},
          form: form,
          onSubmit: ({ filter }) => {
            _.set(field.componentProps, 'params', {
              ...field.componentProps?.params,
              filter,
            });
            fieldSchema['x-component-props']['params'] = field.componentProps.params;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-component-props': fieldSchema['x-component-props'],
              },
            });
          },
        };
      },
      useVisible() {
        const fieldSchema = useFieldSchema();
        return fieldSchema?.['collectionName'];
      },
    },
    {
      name: 'fieldCollection',
      Component: SchemaSettingCollection,
      useVisible() {
        const fieldSchema = useFieldSchema();
        const component = fieldSchema['x-component'];
        return component === 'Select' || component === 'AutoComplete';
      },
    },
    {
      name: 'fieldComponent',
      Component: SchemaSettingComponent,
      useVisible() {
        const fieldSchema = useFieldSchema();
        const component = fieldSchema['x-component'];
        const items = ['Select', 'AutoComplete', 'Radio.Group', 'Checkbox.Group'];
        return items.includes(component);
      },
    },
    {
      name: 'titleField',
      type: 'select',
      useComponentProps() {
        const { getCollectionFields, getCollectionJoinField } = useCollectionManager_deprecated();
        const { getField } = useCollection_deprecated();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { t } = useTranslation();
        const { dn } = useDesignable();
        const compile = useCompile();
        const collectionManage = useCollectionManager_deprecated();
        const isCustomFilterItem = ((fieldSchema?.name as string) ?? '').startsWith('__custom.');
        const collectionManageField = isCustomFilterItem
          ? collectionManage.collections.filter((value) => value.name === fieldSchema['x-decorator-props'])[0]
          : {};
        const collectionField =
          getField(fieldSchema['name']) || getCollectionJoinField(fieldSchema['x-collection-field']);
        let targetFields = [];
        if (collectionField) {
          targetFields = collectionField?.target
            ? getCollectionFields(collectionField?.target)
            : getCollectionFields(collectionField?.targetCollection) ?? [];
        } else if (collectionManageField) {
          targetFields = collectionManageField['fields'];
        }
        const options = targetFields
          .filter((field) => !field?.target && field.type !== 'boolean')
          .map((field) => ({
            value: field?.name,
            label: compile(field?.uiSchema?.title) || field?.name,
          }));
        return {
          title: t('Title field'),
          options,
          value: fieldSchema['x-component-props']?.['fieldNames']?.label || 'id',
          onChange(label) {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            const fieldNames = {
              ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
              ...field.componentProps.fieldNames,
              label,
            };
            if (isCustomFilterItem) fieldNames['value'] = label;
            fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
            fieldSchema['x-component-props']['fieldNames'] = fieldNames;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            field.componentProps = fieldSchema['x-component-props'];
            dn.emit('patch', {
              schema,
            });
            dn.refresh();
          },
        };
      },
      useVisible() {
        const fieldSchema = useFieldSchema();
        const component = fieldSchema['x-component'];
        return component === 'Select' || component === 'AutoComplete';
      },
    },
    {
      name: 'EditFormulaTitleField',
      Component: EditFormulaTitleField,
      useVisible() {
        const fieldSchema = useFieldSchema();
        const component = fieldSchema['x-component'];
        return component === 'Select' || component === 'AutoComplete';
      },
    },
    {
      name: 'EditCustomDefaultValue',
      type: 'modal',
      useComponentProps() {
        const { t } = useTranslation();
        const { dn } = useDesignable();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const title = fieldSchema.title;
        return {
          title: t('Set default value'),
          schema: {
            type: 'void',
            title: t('Set default value'),
            properties: {
              default: {
                title,
                'x-decorator': 'FormItem',
                'x-component': FilterCustomVariableInput,
                'x-component-props': {
                  fieldSchema,
                },
              },
            },
          } as ISchema,
          onSubmit({ default: { value } }) {
            field.setValue(value);
            fieldSchema['default'] = value;
            fieldSchema['x-component-props']['defaultValue'] = value;
            dn.emit('patch', {
              schema: {
                'x-uid': fieldSchema['x-uid'],
                ['x-component-props']: fieldSchema['x-component-props'],
                default: fieldSchema.default,
              },
            });
            dn.refresh();
          },
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      // Component: SchemaSettingsCustomRemove,
      // useComponentProps() {
      //   const { t } = useTranslation();
      //   return {
      //     key: 'remove',
      //     confirm: {
      //       title: t('Delete field'),
      //     },
      //     removeParentsIfNoChildren: true,
      //     breakRemoveOn: {
      //       'x-component': 'Grid',
      //     },
      //   };
      // },
      type: 'remove',
    },
  ],
});
