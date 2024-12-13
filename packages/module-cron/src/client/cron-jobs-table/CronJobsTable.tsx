import React from 'react';
import {
  ExtendCollectionsProvider,
  SchemaComponent,
  TableBlockProvider,
  useCollectionRecordData,
} from '@tachybase/client';
import { ExecutionLink, ExecutionStatusColumn, ExecutionTime, OpenDrawer } from '@tachybase/module-workflow/client';

import collection from '../../collections/cronJobs';
import { EndsByField } from '../components/EndsByField';
import { OnField } from '../components/OnField';
import { RepeatField } from '../components/RepeatField';
import { schema } from './CronJobsTable.schema';

export const ExecutionResourceProvider = ({ params, filter = {}, ...others }) => {
  const record = useCollectionRecordData();
  const props = {
    ...others,
    params: {
      ...params,
      filter: {
        ...params?.filter,
        cronJobs: {
          id: record.id,
        },
      },
    },
  };

  return <TableBlockProvider {...props} />;
};

export const CronJobsTable = () => {
  return (
    <ExtendCollectionsProvider collections={[collection]}>
      <SchemaComponent
        schema={schema}
        components={{
          OnField,
          RepeatField,
          EndsByField,
          ExecutionResourceProvider,
          ExecutionLink,
          ExecutionStatusColumn,
          ExecutionTime,
          OpenDrawer,
        }}
      />
    </ExtendCollectionsProvider>
  );
};