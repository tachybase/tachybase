import React, { useEffect, useState } from 'react';
import {
  RecordProvider,
  RemoteSchemaComponent,
  SchemaComponentContext,
  useRequest,
  useSchemaComponentContext,
} from '@tachybase/client';

import { ProviderContextMessage } from '../contexts/Message';

export const ViewCheckContent = (props) => {
  const { record } = props;
  const context = useSchemaComponentContext();
  const { schemaName } = record;
  const [reqRecord, setReqRecord] = useState({});
  const params = {
    filter: {},
  };
  const { run } = useRequest(
    {
      resource: record?.collectionName,
      action: 'get',
      params,
    },
    {
      manual: true,
      onSuccess(res) {
        setReqRecord(res.data || {});
      },
    },
  );
  useEffect(() => {
    if (record && !record?.colletionRecord) {
      if (record?.collectionId) {
        params.filter = {
          id: record.collectionId,
        };
      }
      run();
    }
  }, [record]);
  return (
    Object.keys(reqRecord).length && (
      <RecordProvider record={{ record, ...reqRecord }}>
        <ProviderContextMessage value={record}>
          <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
            <RemoteSchemaComponent uid={schemaName} noForm />
          </SchemaComponentContext.Provider>
        </ProviderContextMessage>
      </RecordProvider>
    )
  );
};
