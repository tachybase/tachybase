import { ExecutionContextProvider } from '@tachybase/module-workflow/client';

import { ProviderContextApprovalExecution } from '../../../common/contexts/approvalExecution';
import { ApprovalContext } from '../../common/ApprovalData.provider';
import { ContextApprovalRecords } from './providers/ApprovalExecutions.provider';

export const ProviderCheckContent = (props) => {
  const { omitWorkflow, nodes, execution, approval, approvalExecution, data, children } = props;
  return (
    <ExecutionContextProvider workflow={omitWorkflow} nodes={nodes} execution={execution}>
      <ApprovalContext.Provider value={approval}>
        <ProviderContextApprovalExecution value={approvalExecution}>
          <ContextApprovalRecords.Provider value={data.data}>{children}</ContextApprovalRecords.Provider>
        </ProviderContextApprovalExecution>
      </ApprovalContext.Provider>
    </ExecutionContextProvider>
  );
};
