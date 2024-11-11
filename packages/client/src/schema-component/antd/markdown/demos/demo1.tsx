/**
 * title: Markdown
 */
import React from 'react';
import { Markdown, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'string',
      title: `Editable`,
      'x-decorator': 'FormItem',
      'x-component': 'Markdown',
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
      type: 'string',
      title: `Read pretty`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Markdown',
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Markdown, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
