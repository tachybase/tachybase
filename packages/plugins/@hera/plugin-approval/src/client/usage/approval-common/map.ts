import { ApprovalDataProvider } from './Pd.ApprovalData';
import { ApprovalProcess } from './VC.ApprovalProcess';

// 通用,审批
export const ApprovalCommon = () => null;

ApprovalCommon.PathNameMap = {
  Provider: {
    ApprovalDataProvider: 'ApprovalCommon.Provider.ApprovalDataProvider',
  },
  ViewComponent: {
    ApprovalProcess: 'ApprovalCommon.ViewComponent.ApprovalProcess',
  },
};

ApprovalCommon.Decorator = null;

ApprovalCommon.Provider = {
  ApprovalDataProvider,
};

ApprovalCommon.BlockInitializer = null;

ApprovalCommon.ViewComponent = {
  ApprovalProcess,
};
