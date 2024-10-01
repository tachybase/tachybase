import React from 'react';
import { FormItem, Input, SchemaComponent } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';

import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';
import { getSchemaHeaders } from './Headers.schema';

export const ViewResponseHeaders = () => {
  const { rawResponse } = useContextResponseInfo();
  const { headers } = rawResponse || {};
  const headerMapList = Object.entries(headers || {}).map(([name, value]) => ({ name, value }));
  const schema = getSchemaHeaders({ key: 'responseHeaders', defaultValue: headerMapList });
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
