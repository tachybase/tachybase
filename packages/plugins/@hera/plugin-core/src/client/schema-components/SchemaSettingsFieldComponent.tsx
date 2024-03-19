import { useField, useFieldSchema } from '@formily/react';
import { SchemaSettingsSelectItem, useCollectionManager, useDesignable } from '@nocobase/client';
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

export const SchemaSettingCollection = () => {
  const fieldSchema = useFieldSchema();
  const field = useField();
  const collections = useCollectionManager();
  const options = collections?.dataSource['options']?.collections.map((value) => {
    return {
      label: value.name,
      value: value.name,
    };
  });
  const { dn } = useDesignable();
  return (
    <SchemaSettingsSelectItem
      key="component-field"
      title="Edit Collection"
      options={options}
      value={fieldSchema['collectionName']}
      onChange={(name) => {
        fieldSchema['collectionName'] = name;
        fieldSchema['name'] = 'custom.' + name;
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
          collectionName: name,
          name: 'custom.' + name,
        };
        void dn.emit('patch', { schema });
        dn.refresh();
      }}
    />
  );
};
