import React from 'react';
import { useRecord } from '@tachybase/client';

import { AddCollectionAction } from './AddCollectionAction.component';

export const AddCollection = (props) => {
  const record = useRecord();
  return <AddCollectionAction item={record} {...props} />;
};
