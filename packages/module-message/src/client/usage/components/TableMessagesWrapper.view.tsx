import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { getSchemaTableMessagesWrapper } from './TableMessagesWrapper.schema';

export const ViewTableMessagesWrapper = (props) => {
  const schema = getSchemaTableMessagesWrapper(props);
  return <SchemaComponent memoized schema={schema} />;
};
