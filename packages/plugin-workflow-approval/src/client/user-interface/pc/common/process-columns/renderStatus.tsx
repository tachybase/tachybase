import { useCompile } from '@tachybase/client';

import { Tag } from 'antd';

import { APPROVAL_INITIATION_STATUS } from '../../../../common/constants/approval-initiation-status';
import { approvalInitiationStatusMap } from '../../../../common/constants/approval-initiation-status-options';
import { approvalTodoStatusMap } from '../../../../common/constants/approval-todo-status-options';
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
      approvalInitiationStatusMap[
        record.status === APPROVAL_INITIATION_STATUS.DRAFT
          ? APPROVAL_INITIATION_STATUS.DRAFT
          : APPROVAL_INITIATION_STATUS.SUBMITTED
      ];
    return <Tag color={approvalStatusItem.color}>{compile(approvalStatusItem.label)}</Tag>;
  }

  const option = approvalTodoStatusMap[value];
  return <ColumnStatusComponent value={value} record={record} option={option} />;
};
