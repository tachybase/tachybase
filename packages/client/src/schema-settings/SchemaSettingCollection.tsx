import React from 'react';
import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { useCollectionManager } from '../data-source';
import { useDesignable } from '../schema-component';
import { SchemaSettingsSelectItem } from './SchemaSettings';

export const SchemaSettingCollection = () => {
  const fieldSchema = useFieldSchema();
  const collections = useCollectionManager();
  const field = useField<Field>();
  const options = collections?.dataSource['options']?.collections.map((value) => {
    return {
      label: value.title,
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
        field.setValue('');
        const titleField = collections.getCollection(name).titleField;
        fieldSchema['collectionName'] = name;
        fieldSchema.default = '';
        fieldSchema['x-component-props'] = {
          ...fieldSchema['x-component-props'],
          collection: name,
          fieldNames: {
            label: titleField,
            value: titleField,
          },
          defaultValue: '',
        };
        fieldSchema['x-decorator-props'] = name;
        field.componentProps = fieldSchema['x-component-props'];
        void dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            collectionName: fieldSchema['collectionName'],
            ['x-component-props']: fieldSchema['x-component-props'],
            ['x-decorator-props']: fieldSchema['x-decorator-props'],
            default: '',
          },
        });
        dn.refresh();
      }}
    />
  );
};
