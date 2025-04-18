import { ActionBarProvider as ClientActionBarProvider, useCompile } from '@tachybase/client';
import { str2moment } from '@tachybase/utils/client';

import { Space, Tag } from 'antd';

import { approvalTodoStatusMap } from '../../../../../common/constants/approval-todo-status-options';
import { useContextApprovalRecords } from './ApprovalExecutions.provider';

export const ActionBarProvider = (props) => {
  const { status } = useContextApprovalRecords();

  if (status) {
    return <ComponentUserInfo />;
  } else {
    return <ClientActionBarProvider {...props} />;
  }
};

const ComponentUserInfo = () => {
  const compile = useCompile();
  const { status, updatedAt, user } = useContextApprovalRecords() as any;
  const configObj = approvalTodoStatusMap[status];
  return (
    <Space>
      <Tag color={configObj.color}>{compile(configObj.label)}</Tag>
      <time>{str2moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</time>
      <Tag>{user.nickname}</Tag>
    </Space>
  );
};
