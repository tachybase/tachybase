import React from 'react';
import { RemoteSchemaComponent, SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

import { ProviderContextMessage } from '../contexts/Message';

export const ViewCheckContent = (props) => {
  const { record } = props;
  const context = useSchemaComponentContext();
  const { schemaName } = record;

  return (
    <ProviderContextMessage value={record}>
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        <RemoteSchemaComponent uid={schemaName} noForm />
      </SchemaComponentContext.Provider>
    </ProviderContextMessage>
  );
};
