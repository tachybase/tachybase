import React from 'react';
import { ExtendCollectionsProvider, SchemaComponent, SchemaComponentOptions } from '@tachybase/client';
import { FormTab } from '@tachybase/components';

import { collection } from './CloudComponentManager.collection';
import { schema } from './CloudComponentManager.schema';

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
