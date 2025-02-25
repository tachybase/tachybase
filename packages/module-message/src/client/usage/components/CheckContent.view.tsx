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
    filterByTk: {},
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
    if (record?.dataKey && !Object.keys(reqRecord).length) {
      params.filterByTk = record.dataKey;
      run();
    }
  }, [record]);
  //目前如果没有dataKey 会默认加载相关表的另一条不相关数据  需要后续优化
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
