import React from 'react';
import { RemoteSchemaComponent, SchemaComponent } from '@tachybase/client';

import { getSchemaCheckContent } from './CheckContent.schema';
import { ProviderSchemaComponentContext } from './SchemaComponentContext.provider';

export const ViewCheckContent = (props) => {
  const { message } = props;
  const schema = getSchemaCheckContent(message);
  return (
    <SchemaComponent
      schema={schema}
      components={{
        ProviderSchemaComponentContext: ProviderSchemaComponentContext,
        RemoteSchemaComponent: RemoteSchemaComponent,
      }}
    />
  );
};
