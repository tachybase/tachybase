import { SchemaComponentContext, useSchemaComponentContext } from '@nocobase/client';
import React from 'react';

export function SchemaComponentContextProvider({ designable, children }) {
  const schemaComponentContext = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...schemaComponentContext, designable }}>
      {children}
    </SchemaComponentContext.Provider>
  );
}
