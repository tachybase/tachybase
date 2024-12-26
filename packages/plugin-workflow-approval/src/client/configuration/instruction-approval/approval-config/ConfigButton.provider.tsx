import React from 'react';
import { useActionContext } from '@tachybase/client';

import { ProviderContextApproverConfig } from '../contexts/ApproverConfig';

// 审批人操作界面->进入配置按钮
export const ProviderConfigButton = (props) => {
  const { setFormValueChanged } = useActionContext();
  return (
    <ProviderContextApproverConfig value={{ setFormValueChanged }}>{props.children}</ProviderContextApproverConfig>
  );
};
