import { useCollectionRecordData, useCompile } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Tag } from 'antd';
import _ from 'lodash';

import { approvalInitiationStatusMap } from '../../../../common/constants/approval-initiation-status-options';

export const ColumnApprovalStatus = observer(
  () => {
    const record = useCollectionRecordData();
    const { approval } = record;
    return <ColumnStatusComponent value={approval?.status} record={record} />;
  },
  { displayName: 'ColumnApprovalStatus' },
);

// 审批-待办:状态列:值
export const ColumnStatusComponent = (props) => {
  const compile = useCompile();
  const { value } = props;
  const option = approvalInitiationStatusMap[value];

  return <Tag color={option.color}>{compile(option.label)}</Tag>;
};
