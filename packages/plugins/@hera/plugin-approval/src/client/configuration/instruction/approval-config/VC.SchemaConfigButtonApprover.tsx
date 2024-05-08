import { useActionContext } from '@tachybase/client';
import React from 'react';
import { SchemaConfigButton } from '../../trigger/VC.ConfigButton';
import { ContextApproverConfig } from '../Pd.ContextApproverConfig';

// 审批人操作界面->进入配置按钮
export const SchemaConfigButtonApprover = (props) => {
  const { setFormValueChanged } = useActionContext();
  return (
    <ContextApproverConfig.Provider value={{ setFormValueChanged }}>
      <SchemaConfigButton {...props} />
    </ContextApproverConfig.Provider>
  );
};
