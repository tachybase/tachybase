import React from 'react';
import { FormItem, Input, SchemaComponent } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';

import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';
import { getSchemaResponseBody } from './ResponseBody.schema';

export const ViewResponseBody = () => {
  const { rawResponse } = useContextResponseInfo();
  const { data } = rawResponse || {};
  const schema = getSchemaResponseBody(data);

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
