import { RecordApprovalsDecorator } from './Dt.RecordApprovals';
import { RecordApprovalsInitializer } from './Iz.RecordApprovals';
import { RecordApprovals } from './VC.RecordApprovals';

// 区块-相关审批
export const ApprovalRecordBlock = () => null;

// Think: 这里其实可以从框架层面定义, 现在是取名字,
// 可以改为, name和component的对象.让开发体验更友好.
// 目前只是适应框架现在的定义,这样处理
// 名称映射,声明而不是生成,提供ts较好的路径提示信息,便于修改,以及避免遍历计算带来的性能损耗
ApprovalRecordBlock.PathNameMap = {
  Decorator: 'ApprovalRecordBlock.Decorator',
  BlockInitializer: 'ApprovalRecordBlock.BlockInitializer',
  ViewComponent: 'ApprovalRecordBlock.ViewComponent',
};

ApprovalRecordBlock.Decorator = RecordApprovalsDecorator;

ApprovalRecordBlock.BlockInitializer = RecordApprovalsInitializer;

ApprovalRecordBlock.ViewComponent = RecordApprovals;

// ApprovalRecordBlock.PathNameMap = getPathNameMap(ApprovalRecordBlock);
// 改为如下形式, 需要改addComponent的机制, 以及加载组件的机制
// 以下代码为 demo
// export const ApprovalRecordBlock1 = {
//   Decorator: {
//     name: 'ApprovalRecordBlock.Decorator',
//     component: RecordApprovalsDecorator,
//   },
//   Provider: {
//     name: '',
//     component: null,
//   },
//   BlockInitializer: {
//     name: 'ApprovalRecordBlock.BlockInitializer',
//     component: RecordApprovalsInitializer,
//   },
//   ViewComponent: {
//     name: 'ApprovalRecordBlock.ViewComponent',
//     component: RecordApprovals,
//   },
// };
