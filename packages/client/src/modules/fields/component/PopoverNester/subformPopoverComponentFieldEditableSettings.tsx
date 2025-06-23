import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { EditableSchemaSettings } from '../../../../application/schema-settings-editable';
import { useFieldComponentName } from '../../../../common/useFieldComponentName';
import { useCollectionField } from '../../../../data-source';
import { useFieldModeOptions, useIsAddNewForm } from '../../../../schema-component';
import { isSubMode } from '../../../../schema-component/antd/association-field/util';
import {
  useIsFieldReadPretty,
  useTitleFieldOptions,
} from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import { useEditableDesignable } from '../../../blocks/data-blocks/form-editor/EditableDesignable';

export const subformPopoverComponentFieldEditableSettings = new EditableSchemaSettings({
  name: 'editableFieldSettings:component:PopoverNester',
  items: [
    {
      name: 'fieldComponent',
      useSchema() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const { fieldSchema: tableColumnSchema, collectionField } = useColumnSchema();
        const schema = useFieldSchema();
        const fieldSchema = tableColumnSchema || schema;
        const fieldModeOptions = useFieldModeOptions({ fieldSchema: tableColumnSchema, collectionField });
        const { refresh } = useEditableDesignable();
        const isAddNewForm = useIsAddNewForm();
        const fieldMode = useFieldComponentName();
        return {
          type: 'string',
          title: '{{t("Field component")}}',
          default: fieldMode,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: fieldModeOptions,
            allowClear: false,
            showSearch: false,
            onChange(mode) {
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
              fieldSchema['x-component-props']['mode'] = mode;
              schema['x-component-props'] = fieldSchema['x-component-props'];
              field.componentProps = field.componentProps || {};
              field.componentProps.mode = mode;
              // 子表单状态不允许设置默认值
              if (isSubMode(fieldSchema) && isAddNewForm) {
                // @ts-ignore
                schema.default = null;
                fieldSchema.default = null;
                field.setInitialValue(null);
                field.setValue(null);
              }
              refresh();
            },
          },
        };
      },
    },
    {
      name: 'allowMultiple',
      useVisible() {
        const isFieldReadPretty = useIsFieldReadPretty();
        const collectionField = useCollectionField();
        return !isFieldReadPretty && ['hasMany', 'belongsToMany'].includes(collectionField?.type);
      },
      useSchema() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { refresh } = useEditableDesignable();
        return {
          type: 'boolean',
          default:
            fieldSchema['x-component-props']?.multiple === undefined ? true : fieldSchema['x-component-props'].multiple,
          'x-decorator': 'FormItem',
          'x-component': 'Checkbox',
          'x-content': '{{t("Allow multiple")}}',
          'x-component-props': {
            onInput(e) {
              const value = e?.target?.checked ?? false;
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
              field.componentProps = field.componentProps || {};

              fieldSchema['x-component-props'].multiple = value;
              field.componentProps.multiple = value;

              schema['x-component-props'] = fieldSchema['x-component-props'];
              refresh();
            },
          },
        };
      },
    },
    {
      name: 'titleField',
      useSchema() {
        const { t } = useTranslation();
        const field = useField<Field>();
        const { uiSchema, fieldSchema: tableColumnSchema, collectionField: tableColumnField } = useColumnSchema();
        const options = useTitleFieldOptions();
        const schema = useFieldSchema();
        const fieldSchema = tableColumnSchema || schema;
        const targetCollectionField = useCollectionField();
        const collectionField = tableColumnField || targetCollectionField;
        const { refresh } = useEditableDesignable();
        const fieldNames =
          field?.componentProps?.fieldNames ||
          fieldSchema?.['x-component-props']?.['fieldNames'] ||
          uiSchema?.['x-component-props']?.['fieldNames'];
        return {
          type: 'string',
          title: '{{t("Title field")}}',
          default: fieldNames?.label,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options,
            allowClear: false,
            showSearch: false,
            onChange(label) {
              const schema = {
                ['x-uid']: fieldSchema['x-uid'],
              };
              const fieldNames = {
                ...collectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
                ...field.componentProps.fieldNames,
                label,
              };
              fieldSchema['x-component-props'] = fieldSchema['x-component-props'] || {};
              fieldSchema['x-component-props']['fieldNames'] = fieldNames;
              schema['x-component-props'] = fieldSchema['x-component-props'];
              field.componentProps.fieldNames = fieldSchema['x-component-props'].fieldNames;
              refresh();
            },
          },
        };
      },
    },
  ],
});
