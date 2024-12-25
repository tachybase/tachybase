import React from 'react';
import { useActionContext } from '@tachybase/client';

import { ConfigButtonView } from '../../trigger-approval/ConfigButton.view';
import { ContextApproverConfig } from '../ApproverConfig.context';

// 审批人操作界面->进入配置按钮
export const SchemaConfigButtonApprover = (props) => {
  const { setFormValueChanged } = useActionContext();
  return (
    <ContextApproverConfig.Provider value={{ setFormValueChanged }}>
      <ConfigButtonView {...props} />
    </ContextApproverConfig.Provider>
  );
};
