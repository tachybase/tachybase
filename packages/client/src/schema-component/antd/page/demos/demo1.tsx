import React from 'react';
import { Application, DocumentTitleProvider, Page, SchemaComponent, SchemaComponentProvider } from '@tachybase/client';
import { ISchema } from '@tachybase/schema';

const schema: ISchema = {
  type: 'object',
  properties: {
    page1: {
      type: 'void',
      'x-component': 'Page',
      title: 'Page Title',
      properties: {
        content: {
          type: 'void',
          'x-component': 'div',
          'x-content': 'Page Content',
        },
      },
    },
  },
};

const Root = () => {
  return (
    <SchemaComponentProvider components={{ Page }}>
      <DocumentTitleProvider addonAfter={'TachyBase'}>
        <SchemaComponent schema={schema} />
      </DocumentTitleProvider>
    </SchemaComponentProvider>
  );
};

const app = new Application({
  providers: [Root],
});

export default app.getRootComponent();
