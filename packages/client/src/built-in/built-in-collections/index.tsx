import React from 'react';

import { Plugin } from '../../application/Plugin';
import { CollectionOptions, ExtendCollectionsProvider } from '../../data-source';

export class PluginBuiltInCollections extends Plugin {
  async load() {
    this.app.use(BuiltInCollectionsProvider);
  }
}

export const collection: CollectionOptions = {
  name: 'test-test',
  title: 'TestTest',
  fields: [
    {
      type: 'string',
      name: 'name',
      interface: 'input',
      uiSchema: {
        title: 'Name',
        type: 'string',
        'x-component': 'Input',
        required: true,
      },
    },
    {
      type: 'boolean',
      name: 'enabled',
      interface: 'radioGroup',
      uiSchema: {
        title: 'Enabled',
        type: 'string',
        required: true,
        enum: [
          { label: 'On', value: true },
          { label: 'Off', value: false },
        ],
        'x-component': 'Radio.Group',
        'x-decorator': 'FormItem',
        default: false,
      },
    },
  ],
};

const BuiltInCollectionsProvider = ({ children }) => {
  return <ExtendCollectionsProvider collections={[collection]}>{children}</ExtendCollectionsProvider>;
};
