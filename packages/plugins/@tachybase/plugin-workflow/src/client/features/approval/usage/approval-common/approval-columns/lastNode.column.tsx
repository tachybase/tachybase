import React, { useMemo } from 'react';
import { useCollectionRecordData } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../../constants';

export const ApprovalLastNodeColumn = () => {
  const approvalContext = useCollectionRecordData();

  const lastNodeTitle = useMemo(() => getLastNodeTitle(approvalContext), [approvalContext]);

  return <div>{lastNodeTitle}</div>;
};

function getLastNodeTitle(approvalContext) {
  const { records } = approvalContext;
  let targetRecord = records.find(({ status }) => status !== APPROVAL_ACTION_STATUS.APPROVED);
  if (!targetRecord) {
    targetRecord = records.pop() || {};
  }

  const lastNodeTitle = targetRecord.node?.title;

  return lastNodeTitle;
}
