import React from 'react';
import { SchemaComponent, SchemaComponentContext, useSchemaComponentContext } from '@tachybase/client';

import { ViewTableMessagesWrapper } from '../components/TableMessagesWrapper.view';
import { schemaPageMessages as schema } from './PageMessages.schema';

export const ViewPageMessages = () => {
  const context = useSchemaComponentContext();
  return (
    <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
      <SchemaComponent
        schema={schema}
        components={{
          ViewTableMessagesWrapper: ViewTableMessagesWrapper,
        }}
      />
    </SchemaComponentContext.Provider>
  );
};
