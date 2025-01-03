import React from 'react';
import { useCompile } from '@tachybase/client';

import { Tag } from 'antd';

import { APPROVAL_STATUS, approvalStatusConfigObj, ApprovalStatusEnumDict } from '../../constants';
import { ColumnStatusComponent } from '../approval-columns/status.column';

export function renderStatus(value, record, index) {
  return <ColumnStatus value={value} record={record} index={index} />;
}

const ColumnStatus = (props) => {
  const { value, record, index } = props;
  const compile = useCompile();

  if (!index) {
    // 第一个必定为发起项
    const approvalStatusItem =
      ApprovalStatusEnumDict[
        record.status === APPROVAL_STATUS.DRAFT ? APPROVAL_STATUS.DRAFT : APPROVAL_STATUS.SUBMITTED
      ];
    return <Tag color={approvalStatusItem.color}>{compile(approvalStatusItem.label)}</Tag>;
  }

  const option = approvalStatusConfigObj[value];
  return <ColumnStatusComponent value={value} record={record} option={option} />;
};
