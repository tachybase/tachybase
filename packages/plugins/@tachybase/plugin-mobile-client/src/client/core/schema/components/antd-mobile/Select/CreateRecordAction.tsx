import React, { useState } from 'react';
import {
  CollectionProvider,
  CollectionProvider_deprecated,
  useActionContext,
  useCollectionManager,
  useCollectionManager_deprecated,
} from '@tachybase/client';
import { RecursionField } from '@tachybase/schema';

import { useInsertSchema } from './hook/hooks';
import schema from './schema';

export const CreateRecordAction = ({ field, fieldSchema, targetCollection }) => {
  const [currentCollection, setCurrentCollection] = useState(targetCollection?.name);
  const [currentDataSource, setCurrentDataSource] = useState(targetCollection?.dataSource);
  return (
    <CollectionProvider_deprecated name={currentCollection} dataSource={currentDataSource}>
      <RecursionField
        onlyRenderProperties
        basePath={field.address}
        schema={fieldSchema}
        filterProperties={(s) => {
          return s['x-component'] === 'AssociationField.AddNewer';
        }}
      />
    </CollectionProvider_deprecated>
  );
};
