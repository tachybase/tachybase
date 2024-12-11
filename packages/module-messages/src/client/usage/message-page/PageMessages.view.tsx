import React from 'react';
import { SchemaComponent, SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

import { ProviderCollectionMessages } from '../components/CollectionMessages.provider';
import { ViewTableMessages } from '../components/TableMessages.view';
import { schemaPageMessages as schema } from './PageMessages.schema';

export const ViewPageMessages = () => {
  const context = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
      <SchemaComponent
        schema={schema}
        components={{
          ProviderCollectionMessages: ProviderCollectionMessages,
          ViewTableMessages: ViewTableMessages,
        }}
      />
    </SchemaComponentContext.Provider>
  );
};
