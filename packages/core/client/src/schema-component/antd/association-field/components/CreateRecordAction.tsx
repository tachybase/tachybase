import React, { useState } from 'react';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { CollectionProvider_deprecated, useCollectionManager_deprecated } from '../../../../collection-manager';
import { CreateAction } from '../../../../schema-initializer/components';
import { ActionContextProvider, useActionContext } from '../../action';
import { useAssociationFieldContext, useInsertSchema } from '../hooks';
import schema from '../schema';

export const CreateRecordAction = observer(
  (props) => {
    const field: any = useField();
    const fieldSchema = useFieldSchema();
    const ctx = useActionContext();
    const { getCollection } = useCollectionManager_deprecated();
    const insertAddNewer = useInsertSchema('AddNewer');
    const { options: collectionField } = useAssociationFieldContext();
    const [visibleAddNewer, setVisibleAddNewer] = useState(false);
    const targetCollection = getCollection(collectionField?.target);
    const [currentCollection, setCurrentCollection] = useState(targetCollection?.name);
    const [currentDataSource, setCurrentDataSource] = useState(targetCollection?.dataSource);
    const addbuttonClick = (collectionData) => {
      insertAddNewer(schema.AddNewer);
      setVisibleAddNewer(true);
      setCurrentCollection(collectionData.name);
      setCurrentDataSource(collectionData.dataSource);
    };
    return (
      <CollectionProvider_deprecated name={collectionField?.target}>
        <CreateAction {...props} onClick={(arg) => addbuttonClick(arg)} />
        <ActionContextProvider value={{ ...ctx, visible: visibleAddNewer, setVisible: setVisibleAddNewer }}>
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
        </ActionContextProvider>
      </CollectionProvider_deprecated>
    );
  },
  { displayName: 'CreateRecordAction' },
);
