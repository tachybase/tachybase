import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';

import { collection } from './CloudLibrary.collection';
import { schema } from './CloudLibraryManager.schema';

export const CloudLibraryManager = () => {
  return (
    <ExtendCollectionsProvider collections={[collection]}>
      <SchemaComponent schema={schema} name="cloudLibrary" />
    </ExtendCollectionsProvider>
  );
};
