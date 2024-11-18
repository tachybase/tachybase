import React from 'react';
import { RecordProvider, useRecord } from '@tachybase/client';

export function ProviderRecord(props) {
  const { latestExecutionId } = useRecord();
  return (
    // @ts-ignore
    <RecordProvider record={{ id: latestExecutionId }} parent={false}>
      {props.children}
    </RecordProvider>
  );
}