import { ViewActionTodos } from './todos/VC.ViewActionTodos';
import { ApprovalBlockComponent } from './VC.ApprovalBlock';
import { ApprovalBlockTodos } from './todos/VC.ApprovalBlockTodos';
import { ViewActionLaunch } from './launch/VC.ViewActionLaunch';
import { ApprovalBlockDecorator } from './Dt.ApprovalBlock';

import { ApprovalBlockLaunch } from './launch/VC.ApprovalBlockLaunch';

// 区块-审批
export const ApprovalBlock = () => null;

export const PathNameMap_ApprovalBlock = {
  Decorator: 'ApprovalBlock.Decorator',
  BlockInitializer: 'ApprovalBlock.BlockInitializer',
  Launch: 'ApprovalBlock.Launch',
  Todos: 'ApprovalBlock.Todos',
  ViewActionLaunch: 'ApprovalBlock.ViewActionLaunch',
  ViewActionTodos: 'ApprovalBlock.ViewActionTodos',
};

ApprovalBlock.Decorator = ApprovalBlockDecorator;

ApprovalBlock.BlockInitializer = ApprovalBlockComponent;

ApprovalBlock.Launch = ApprovalBlockLaunch;

ApprovalBlock.Todos = ApprovalBlockTodos;

ApprovalBlock.ViewActionLaunch = ViewActionLaunch;

ApprovalBlock.ViewActionTodos = ViewActionTodos;
