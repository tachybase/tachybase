import React from 'react';
import { ActionBarProvider as ClientActionBarProvider, useCompile } from '@tachybase/client';
import { str2moment } from '@tachybase/utils/client';
import { Space, Tag } from 'antd';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';
import { approvalStatusOptions } from '../../constants';

export function ActionBarProvider(props) {
  const { status } = useContextApprovalExecution();

  if (status) {
    return <ComponentUserInfo />;
  } else {
    return <ClientActionBarProvider {...props} />;
  }
}

const ComponentUserInfo = () => {
  const compile = useCompile();
  const { status, updatedAt, user } = useContextApprovalExecution();
  const configObj = approvalStatusOptions.find((value) => value.value === status);
  return (
    <Space>
      <Tag color={configObj.color}>{compile(configObj.label)}</Tag>
      <time>{str2moment(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</time>
      <Tag>{user.nickname}</Tag>
    </Space>
  );
};
