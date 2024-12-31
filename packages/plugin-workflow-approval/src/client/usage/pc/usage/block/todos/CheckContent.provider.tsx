import React from 'react';
import { ExecutionContextProvider } from '@tachybase/module-workflow/client';

import { ApprovalContext } from '../../common/ApprovalData.provider';
import { ContextApprovalExecution } from '../common/ApprovalExecution.provider';
import { ContextApprovalRecords } from './providers/ApprovalExecutions.provider';

export const ProviderCheckContent = (props) => {
  const { omitWorkflow, nodes, execution, approval, approvalExecution, data, children } = props;
  return (
    <ExecutionContextProvider workflow={omitWorkflow} nodes={nodes} execution={execution}>
      <ApprovalContext.Provider value={approval}>
        <ContextApprovalExecution.Provider value={approvalExecution}>
          <ContextApprovalRecords.Provider value={data.data}>{children}</ContextApprovalRecords.Provider>
        </ContextApprovalExecution.Provider>
      </ApprovalContext.Provider>
    </ExecutionContextProvider>
  );
};
