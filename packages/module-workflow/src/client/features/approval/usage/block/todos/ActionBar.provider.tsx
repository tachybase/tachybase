import React from 'react';
import { ActionBarProvider as ClientActionBarProvider, useCompile } from '@tachybase/client';
import { str2moment } from '@tachybase/utils/client';

import { Space, Tag } from 'antd';

import { approvalStatusConfigObj } from '../../../constants';
import { useContextApprovalRecords } from './ApprovalExecutions.provider';

export function ActionBarProvider(props) {
  const { status } = useContextApprovalRecords();

  if (status) {
    return <ComponentUserInfo />;
  } else {
    return <ClientActionBarProvider {...props} />;
  }
}

const ComponentUserInfo = () => {
  const compile = useCompile();
  const { status, updatedAt, user } = useContextApprovalRecords() as any;
  const configObj = approvalStatusConfigObj[status];
  return (
    <Space>
      <Tag color={configObj.color}>{compile(configObj.label)}</Tag>
      <time>{str2moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</time>
      <Tag>{user.nickname}</Tag>
    </Space>
  );
};
