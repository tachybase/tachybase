import { ApprovalContext } from '../../common/ApprovalData.provider';
import { ResubmitProvider } from '../../common/Resubmit.provider';
import { ContextApprovalExecution } from '../common/ApprovalExecution.provider';
import { FlowContextProvider } from '../common/FlowContext.provider';

export const ProviderCheckContent = (props) => {
  const { params, children } = props;
  const { workflow, approval, execution, approvalValue } = params;

  return (
    <FlowContextProvider
      value={{
        workflow: workflow,
        nodes: approval?.nodes,
        execution: execution,
      }}
    >
      <ApprovalContext.Provider value={approval}>
        <ContextApprovalExecution.Provider value={approvalValue}>
          <ResubmitProvider>{children}</ResubmitProvider>
        </ContextApprovalExecution.Provider>
      </ApprovalContext.Provider>
    </FlowContextProvider>
  );
};
