import React from 'react';
import { SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

export const ProviderSchemaComponentContext = (props) => {
  const { designable, children } = props;
  const schemaComponentContext = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...schemaComponentContext, designable }}>
      {children}
    </SchemaComponentContext.Provider>
  );
};
