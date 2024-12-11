import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { ProviderCollectionMessages } from '../components/CollectionMessages.provider';
import { ViewTableMessages } from '../components/TableMessages.view';
import { schemaPageMessages as schema } from './PageMessages.schema';

export const ViewPageMessages = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        ProviderCollectionMessages: ProviderCollectionMessages,
        ViewTableMessages: ViewTableMessages,
      }}
    />
  );
};
