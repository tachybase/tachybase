import React from 'react';
import { SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

export function SchemaComponentContextProvider({ designable, children }) {
  const schemaComponentContext = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...schemaComponentContext, designable }}>
      {children}
    </SchemaComponentContext.Provider>
  );
}
