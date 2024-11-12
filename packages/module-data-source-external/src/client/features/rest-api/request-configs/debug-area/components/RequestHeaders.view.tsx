import React from 'react';
import { FormItem, Input, SchemaComponent } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';

import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';
import { getSchemaHeaders } from './Headers.schema';

export const ViewRequestHeaders = () => {
  const { rawResponse } = useContextResponseInfo();
  const { request } = rawResponse || {};
  const requestHeaderMapList = Object.entries(request?.headers || {}).map(([name, value]) => ({ name, value }));

  const schema = getSchemaHeaders({ key: 'requestHeaders', defaultValue: requestHeaderMapList });

  return (
    <SchemaComponent
      schema={schema}
      components={{
        ArrayTable,
        FormItem,
        Input,
      }}
    />
  );
};
