import React from 'react';
import { useRecord } from '@tachybase/client';

import { EditCollectionAction } from './EditCollectionAction.component';

export const EditCollection = (props) => {
  const record = useRecord();
  return <EditCollectionAction item={record} {...props} />;
};
