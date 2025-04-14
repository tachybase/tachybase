import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../common/approval-columns/node.column';
import { ApprovalRecordStatusColumn } from '../../common/approval-columns/status.column';
import { UserColumn } from '../../common/approval-columns/user.column';
import { WorkflowColumn } from '../../common/approval-columns/workflow.column';
import { FuzzySearch } from '../common/FuzzySearch';
import { ViewCheckLink } from './CheckLink.view';
import { schemaTableTodos as schema } from './TableTodos.schema';

/**
 * DOC:
 * 区块初始化组件: 审批: 我的待办
 */
export const ViewTableTodos = () => (
  <SchemaComponent
    schema={schema}
    components={{
      FuzzySearch,
      ViewCheckLink,
      NodeColumn,
      WorkflowColumn,
      UserColumn,
      ApprovalRecordStatusColumn,
    }}
  />
);
