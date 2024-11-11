/**
 * title: Variable.Input
 */
import React from 'react';
import { SchemaComponent, SchemaComponentProvider, Variable } from '@tachybase/client';
import { FormItem } from '@tachybase/components';

const scope = [
  { label: 'v1', value: 'v1' },
  { label: 'nested', value: 'nested', children: [{ label: 'v2', value: 'v2' }] },
];

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'string',
      title: `JSON 模式`,
      'x-decorator': 'FormItem',
      'x-component': 'Variable.JSON',
      'x-component-props': {
        scope,
      },
      // 'x-reactions': {
      //   target: 'read',
      //   fulfill: {
      //     state: {
      //       value: '{{$self.value}}',
      //     },
      //   },
      // },
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Variable, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
