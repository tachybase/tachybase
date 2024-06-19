import React from 'react';
import { useActionContext } from '@tachybase/client';

import { ConfigButtonView } from '../../trigger/ConfigButton.view';
import { ContextApproverConfig } from '../Pd.ContextApproverConfig';

// 审批人操作界面->进入配置按钮
export const SchemaConfigButtonApprover = (props) => {
  const { setFormValueChanged } = useActionContext();
  return (
    <ContextApproverConfig.Provider value={{ setFormValueChanged }}>
      <ConfigButtonView {...props} />
    </ContextApproverConfig.Provider>
  );
};
