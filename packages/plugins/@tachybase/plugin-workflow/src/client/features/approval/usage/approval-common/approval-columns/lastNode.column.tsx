import React, { useMemo } from 'react';
import { useCollectionRecordData } from '@tachybase/client';

import { APPROVAL_ACTION_STATUS } from '../../../constants';
import { useTranslation } from '../../../locale';

export const ApprovalLastNodeColumn = () => {
  const approvalContext = useCollectionRecordData();
  const { t } = useTranslation();

  const lastNodeTitle = useMemo(() => getLastNodeTitle(approvalContext), [approvalContext]);

  return <div>{lastNodeTitle || t('Not initiated')}</div>;
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
