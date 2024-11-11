import React from 'react';
import { CardItem, FormProvider, SchemaComponent } from '@tachybase/client';

const schema = {
  type: 'object',
  properties: {
    card: {
      type: 'void',
      'x-component': 'CardItem',
      'x-component-props': {
        title: 'Card',
      },
      properties: {
        hello: {
          type: 'void',
          'x-component': 'div',
          'x-content': 'Hello Card!',
        },
      },
    },
  },
};

export default () => {
  return (
    <FormProvider>
      <SchemaComponent components={{ CardItem }} schema={schema} />
    </FormProvider>
  );
};
