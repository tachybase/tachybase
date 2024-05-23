import React from 'react';
import { CollectionHistoryProvider, SchemaComponentOptions } from '@tachybase/client';

import { SnapshotOwnerCollectionFieldsSelect } from './components/SnapshotOwnerCollectionFieldsSelect';
import { SnapshotBlockInitializersDetailItem } from './SnapshotBlock/SnapshotBlockInitializers/SnapshotBlockInitializersDetailItem';
import { SnapshotBlockProvider } from './SnapshotBlock/SnapshotBlockProvider';
import { SnapshotRecordPicker } from './SnapshotRecordPicker';

export const SnapshotFieldProvider = React.memo((props) => {
  return (
    <CollectionHistoryProvider>
      <SchemaComponentOptions
        components={{
          SnapshotRecordPicker,
          SnapshotBlockProvider,
          SnapshotBlockInitializersDetailItem,
          SnapshotOwnerCollectionFieldsSelect,
        }}
      >
        {props.children}
      </SchemaComponentOptions>
    </CollectionHistoryProvider>
  );
});
SnapshotFieldProvider.displayName = 'SnapshotFieldProvider';
