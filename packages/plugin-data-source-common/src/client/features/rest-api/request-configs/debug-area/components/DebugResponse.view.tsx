import React from 'react';
import { FormItem, Input, SchemaComponent } from '@tachybase/client';
import { ArrayTable } from '@tachybase/components';

import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';
import { getSchemaDebugResponse } from './DebugResponse.schema';

export const ViewDebugResponse = () => {
  const { debugResponse } = useContextResponseInfo();
  const schema = getSchemaDebugResponse(debugResponse);
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
