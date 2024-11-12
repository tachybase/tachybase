import { SchemaSettingsItemType, useColumnSchema, useDesignable, useFieldModeOptions } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useTranslation } from '../../../../locale';

export const modeSelectItem: SchemaSettingsItemType = {
  name: 'fieldComponent',
  type: 'select',
  useComponentProps() {
    const { t } = useTranslation();
    const field = useField();
    const { fieldSchema, collectionField } = useColumnSchema();
    const columnSchema = useFieldSchema();
    const schema = fieldSchema || columnSchema;
    const options = useFieldModeOptions({ fieldSchema, collectionField });
    const { dn } = useDesignable();
    return {
      title: t('Field component'),
      options,
      value: 'Select',
      onChange(mode) {
        const newSchema = { 'x-uid': schema['x-uid'] };
        schema['x-component-props'] = schema['x-component-props'] || {};
        schema['x-component-props'].mode = mode;
        newSchema['x-component-props'] = schema['x-component-props'];
        field.componentProps = field.componentProps || {};
        field.componentProps.mode = mode;
        dn.emit('patch', { schema: newSchema }), dn.refresh();
      },
    };
  },
};
