import { useField, useFieldSchema, useForm } from '@formily/react';
import {
  SchemaSettingsSelectItem,
  useCollection,
  useCollectionField,
  useCollectionManager,
  useDesignable,
} from '@nocobase/client';
import React from 'react';

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
