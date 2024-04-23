import React from 'react';
import { useCompile } from '@nocobase/client';
import { Tag } from 'antd';
import { approvalStatusConfigObj } from '../../../constants';
import { ColumnStatusComponent } from '../approval-columns/column.status';
import { ApprovalStatusEnumDict } from '../../../constants';
import { APPROVAL_STATUS } from '../../../constants';

export function renderColumnStatus(value, record, exist) {
  // return null;
  const compile = useCompile();
  if (!exist) {
    const approvalStatusItem =
      ApprovalStatusEnumDict[
        record.status === APPROVAL_STATUS.DRAFT ? APPROVAL_STATUS.DRAFT : APPROVAL_STATUS.SUBMITTED
      ];
    return <Tag color={approvalStatusItem.color}>{compile(approvalStatusItem.label)}</Tag>;
  }

  const option = approvalStatusConfigObj[value];
  return <ColumnStatusComponent value={value} record={record} option={option} />;
}
