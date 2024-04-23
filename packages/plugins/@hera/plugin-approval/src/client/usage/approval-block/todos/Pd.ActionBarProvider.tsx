import React from 'react';
import { ActionBarProvider as ClientActionBarProvider, useCompile } from '@nocobase/client';
import { str2moment } from '@nocobase/utils/client';
import { Space, Tag } from 'antd';
import { approvalStatusConfigObj } from '../../../constants';
import { useContextApprovalExecutions } from './Pd.ApprovalExecutions';

export function ActionBarProvider(props) {
  const { status } = useContextApprovalExecutions();

  if (status) {
    return <ComponentUserInfo />;
  } else {
    return <ClientActionBarProvider {...props} />;
  }
}

const ComponentUserInfo = () => {
  const compile = useCompile();
  const { status, updatedAt, user } = useContextApprovalExecutions() as any;
  const configObj = approvalStatusConfigObj[status];
  return (
    <Space>
      <Tag color={configObj.color}>{compile(configObj.label)}</Tag>
      <time>{str2moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</time>
      <Tag>{user.nickname}</Tag>
    </Space>
  );
};
