import React from 'react';
import { IconPicker, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'boolean',
      title: `Editable`,
      'x-decorator': 'FormItem',
      'x-component': 'IconPicker',
      'x-reactions': {
        target: 'read',
        fulfill: {
          state: {
            value: '{{$self.value}}',
          },
        },
      },
    },
    read: {
      type: 'boolean',
      title: `Read pretty`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'IconPicker',
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ IconPicker, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
