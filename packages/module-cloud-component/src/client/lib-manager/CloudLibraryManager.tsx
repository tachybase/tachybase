import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';
import { FormTab } from '@tachybase/components';

import { collection } from './CloudLibrary.collection';
import { schema } from './CloudLibraryManager.schema';

export const CloudComponentManager = () => {
  return (
    <ExtendCollectionsProvider collections={[collection]}>
      <SchemaComponent
        components={{
          FormTab,
        }}
        schema={schema}
      />
    </ExtendCollectionsProvider>
  );
};
