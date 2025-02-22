import React from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useDesignable } from '../schema-component';
import { useFieldComponents } from '../schema-initializer';
import { SchemaSettingsSelectItem } from './SchemaSettings';

export function SchemaSettingComponent() {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const checkedItems = ['Radio.Group', 'Checkbox.Group'];
  const component = fieldSchema['x-component'];
  const options = useFieldComponents()
    .options.map((item) => {
      if (checkedItems.includes(component)) {
        return checkedItems.includes(item.value) ? item : null;
      } else {
        return checkedItems.includes(item.value) || item.value === 'DatePicker' || item.value === 'AssociationCascader'
          ? null
          : item;
      }
    })
    .filter(Boolean);
  const { dn } = useDesignable();
  return (
    <SchemaSettingsSelectItem
      key="component-field"
      title="Field Component"
      options={options}
      value={fieldSchema['x-component']}
      onChange={(mode) => {
        field.component = mode;
        fieldSchema['x-component'] = mode;
        field.componentProps = fieldSchema['x-component-props'];
        void dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            ['x-component']: fieldSchema['x-component'],
          },
        });
        dn.refresh();
      }}
    />
  );
}
