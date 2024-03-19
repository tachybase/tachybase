import { useField, useFieldSchema } from '@formily/react';
import { SchemaSettingsSelectItem, useDesignable } from '@nocobase/client';
import { useFieldComponents } from '../schema-initializer/FilterFormItemCustomInitializer/FilterFormItemCustom';
import React from 'react';

export const SchemaSettingComponent = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { options } = useFieldComponents();
  const { dn } = useDesignable();
  return (
    <SchemaSettingsSelectItem
      key="component-field"
      title="Field Component"
      options={options}
      value={fieldSchema['x-component']}
      onChange={(mode) => {
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
          ['x-component']: mode,
        };
        field.component = mode;
        void dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  );
};
