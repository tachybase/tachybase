import React from 'react';
import { useRecord } from '@tachybase/client';

import { DeleteCollectionAction } from './DeleteCollectionAction.component';

export const DeleteCollection = (props) => {
  const item = useRecord();
  return <DeleteCollectionAction item={item} {...props} />;
};
