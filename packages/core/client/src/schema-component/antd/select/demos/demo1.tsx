/**
 * title: Select
 */
import { FormItem } from '@tachybase/components';
import { SchemaComponent, SchemaComponentProvider, Select } from '@tachybase/client';
import React from 'react';

const dataSource = [
  {
    label: '福建',
    value: 'FuJian',
    children: [
      { label: '{{t("福州")}}', value: 'FZ' },
      { label: '莆田', value: 'PT' },
    ],
  },
  { label: '江苏', value: 'XZ' },
  { label: '浙江', value: 'ZX' },
];

const schema = {
  type: 'object',
  properties: {
    editable: {
      type: 'string',
      title: `Editable`,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {},
      enum: dataSource,
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
      'x-component': 'Select',
      'x-component-props': {},
      enum: dataSource,
    },
  },
};

const t = (text?: any) => text;

export default () => {
  return (
    <SchemaComponentProvider scope={{ t }} components={{ Select, FormItem }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
