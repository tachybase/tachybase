import React from 'react';
import { Percent, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'number',
      title: `Editable`,
      'x-decorator': 'FormItem',
      'x-component': 'Percent',
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
      type: 'number',
      title: `Read pretty`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Percent',
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Percent, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
