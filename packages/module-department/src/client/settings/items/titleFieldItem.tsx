import {
  SchemaSettingsItemType,
  useCollectionField,
  useColumnSchema,
  useDesignable,
  useTitleFieldOptions,
} from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from '../../locale';

export const titleFieldItem: SchemaSettingsItemType = {
  name: 'titleField',
  type: 'select',
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField();
    const { dn } = useDesignable();
    const options = useTitleFieldOptions();
    const { fieldSchema: fieldSchema, collectionField: collectionField } = useColumnSchema();
    const columnFieldSchema = useFieldSchema();
    const schema = fieldSchema || columnFieldSchema;
    const columnCollectionField = useCollectionField();
    const currentCollectionField = collectionField || columnCollectionField;
    const fieldNames =
      field?.componentProps?.fieldNames ||
      schema?.['x-component-props']?.['fieldNames'] ||
      currentCollectionField?.uiSchema?.['x-component-props']?.['fieldNames'];
    return {
      title: t('Title field'),
      options: options,
      value: fieldNames?.label,
      onChange(label) {
        const newSchema = { 'x-uid': schema['x-uid'] };

        const fieldNames = {
          ...currentCollectionField?.uiSchema?.['x-component-props']?.['fieldNames'],
          ...schema?.['x-component-props']?.fieldNames,
          label,
        };
        schema['x-component-props'] = schema['x-component-props'] || {};
        schema['x-component-props'].fieldNames = fieldNames;
        newSchema['x-component-props'] = schema['x-component-props'];
        field.componentProps.fieldNames = schema['x-component-props']?.fieldNames;
        const f = field.path?.splice(field.path?.length - 1, 1);
        field.form.query(`${f.concat('*.' + schema.name)}`).forEach((field) => {
          field.componentProps.fieldNames = fieldNames.label;
        });
        dn.emit('patch', { schema: newSchema });
        dn.refresh();
      },
    };
  },
};
