import React from 'react';
import {
  ExtendCollectionsProvider,
  SchemaComponent,
  TableBlockProvider,
  useCollectionRecordData,
} from '@tachybase/client';

// import {
//   ExecutionLink,
//   ExecutionRetryAction,
//   ExecutionStatusColumn,
//   OpenDrawer,
// } from '@tachybase/module-workflow/client';

import collection from '../collections/autoBackup';
import { RepeatField } from '../components/RepeatField';
import { schema } from './AutoBackupTable.schema';

// export const ExecutionResourceProvider = ({ params, filter = {}, ...others }) => {
//   const record = useCollectionRecordData();
//   const props = {
//     ...others,
//     params: {
//       ...params,
//       filter: {
//         ...params?.filter,
//         key: record.workflowKey,
//       },
//     },
//   };

//   return <TableBlockProvider {...props} />;
// };

export const AutoBackupTable = () => {
  return (
    <ExtendCollectionsProvider collections={[collection]}>
      <SchemaComponent
        schema={schema}
        name="auto-backup-table"
        components={{
          RepeatField,
          // ExecutionResourceProvider,
          // ExecutionLink,
          // ExecutionStatusColumn,
          // OpenDrawer,
        }}
        // scope={{
        //   ExecutionRetryAction,
        // }}
      />
    </ExtendCollectionsProvider>
  );
};
