/**
 * title: Formula
 */
import React from 'react';
import { Formula, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { connect } from '@tachybase/schema';

const Expression = connect(Formula.Expression);

const schema = {
  type: 'object',
  properties: {
    input: {
      type: 'string',
      default: '{{f1 }} + {{ f2}}',
      'x-component': 'Expression',
      'x-component-props': {
        supports: [
          'checkbox',

          'number',
          'percent',
          'integer',
          'number',
          'percent',

          'input',
          'textarea',
          'email',
          'phone',

          'datetime',
          'createdAt',
          'updatedAt',

          'radioGroup',
          'checkboxGroup',
          'select',
          'multipleSelect',

          // 'json'
        ],
        useCurrentFields: () => {
          return [
            {
              name: 'f1',
              interface: 'number',
              uiSchema: {
                title: 'F1',
              },
            },
            {
              name: 'f2',
              interface: 'number',
              uiSchema: {
                title: 'F2',
              },
            },
          ];
        },
      },
    },
  },
};

export default () => {
  return (
    <SchemaComponentProvider components={{ Expression }}>
      <SchemaComponent schema={schema} />
    </SchemaComponentProvider>
  );
};
