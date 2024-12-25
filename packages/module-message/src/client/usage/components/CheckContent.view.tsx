import React from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  useSchemaComponentContext,
} from '@tachybase/client';

import { ProviderContextMessage } from '../contexts/Message';
import { getSchemaCheckContent } from './CheckContent.schema';

export const ViewCheckContent = (props) => {
  const { record } = props;
  const schema = getSchemaCheckContent(record);
  const context = useSchemaComponentContext();
  return (
    <ProviderContextMessage value={record}>
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        <SchemaComponent
          schema={schema}
          components={{
            RemoteSchemaComponent: RemoteSchemaComponent,
          }}
        />
      </SchemaComponentContext.Provider>
    </ProviderContextMessage>
  );
};
