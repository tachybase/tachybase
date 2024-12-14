import React from 'react';
import { SchemaComponent, useCollectionRecordData } from '@tachybase/client';

import { getSchemaDeleteLink } from './DeleteLink.schema';

export const ViewDeleteLink = (props) => {
  const record = useCollectionRecordData();
  const schema = getSchemaDeleteLink({ record });

  return <SchemaComponent schema={schema} />;
};
