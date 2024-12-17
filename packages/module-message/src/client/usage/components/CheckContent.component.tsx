import React from 'react';
import { useCollectionRecordData } from '@tachybase/client';

import { ProviderCheckContent } from './CheckContent.provider';
import { ViewCheckContent } from './CheckContent.view';

export const CheckContent = () => {
  const recordData = useCollectionRecordData();
  return (
    <ProviderCheckContent message={recordData}>
      <ViewCheckContent message={recordData} />
    </ProviderCheckContent>
  );
};
