import React from 'react';
import { useActionContext } from '@tachybase/client';

import { ConfigButton } from '../../trigger-approval/components/ConfigButton';
import { ProviderContextApproverConfig } from '../contexts/ApproverConfig';

// 审批人操作界面->进入配置按钮
export const SchemaConfigButtonApprover = (props) => {
  const { setFormValueChanged } = useActionContext();
  return (
    <ProviderContextApproverConfig value={{ setFormValueChanged }}>
      <ConfigButton {...props} />
    </ProviderContextApproverConfig>
  );
};
