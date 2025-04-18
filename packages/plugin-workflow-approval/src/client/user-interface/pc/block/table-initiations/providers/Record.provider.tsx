import React from 'react';
import { RecordProvider, useRecord } from '@tachybase/client';

export const ProviderRecord = (props) => {
  const { latestExecutionId } = useRecord();
  return (
    <RecordProvider record={{ id: latestExecutionId }} parent={false}>
      {props.children}
    </RecordProvider>
  );
};
