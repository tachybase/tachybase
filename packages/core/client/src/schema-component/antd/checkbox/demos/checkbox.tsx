/**
 * title: 勾选
 */
import React from 'react';
import { Checkbox, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'boolean',
      title: `编辑模式`,
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
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
      title: `阅读模式`,
      'x-read-pretty': true,
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Checkbox, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
