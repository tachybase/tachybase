import React, { useEffect, useMemo, useState } from 'react';
import {
  ExtendCollectionsProvider,
  SchemaComponent,
  TableBlockProvider,
  useCollectionRecordData,
  useRequest,
} from '@tachybase/client';

// import {
//   ExecutionLink,
//   ExecutionRetryAction,
//   ExecutionStatusColumn,
//   OpenDrawer,
// } from '@tachybase/module-workflow/client';

import collection from '../collections/autoBackup';
import { RepeatField } from '../components/RepeatField';
import { tval, useDuplicatorTranslation } from '../locale';
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
  const { t } = useDuplicatorTranslation();
  const { data, loading, refresh } = useRequest({
    url: 'backupFiles:dumpableCollections',
  });

  const dumpRuleTypes = useMemo(() => {
    if (!data) return [];
    return Object.keys(data).map((key) => ({
      value: key,
      label: t(`${key}.title`),
      disabled: ['required', 'skipped'].includes(key),
    }));
  }, [data]);
  return (
    <ExtendCollectionsProvider collections={[collection]}>
      <SchemaComponent
        schema={schema}
        name="auto-backup-table"
        components={{
          RepeatField,
        }}
        scope={{
          dumpRuleTypes,
        }}
      />
    </ExtendCollectionsProvider>
  );
};
