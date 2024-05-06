import { RecordProvider, useRecord } from '@nocobase/client';
import React from 'react';

export function RecordDecorator(props) {
  const { latestExecutionId } = useRecord();
  return (
    // @ts-ignore
    <RecordProvider record={{ id: latestExecutionId }} parent={false}>
      {props.children}
    </RecordProvider>
  );
}