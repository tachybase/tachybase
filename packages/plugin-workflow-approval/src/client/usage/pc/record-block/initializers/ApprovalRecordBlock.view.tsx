import { SchemaComponent } from '@tachybase/client';

import { ApprovalRecordStatusColumn } from '../../common/approval-columns/status.column';
import { UserColumn } from '../../common/approval-columns/user.column';
import { WorkflowColumn } from '../../common/approval-columns/workflow.column';
import { schemaApprovalRecord as schema } from './ApprovalRecordBlock.schema';

// 视图组件,添加卡片-相关审批
export const ViewApprovalRecordBlock = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        WorkflowColumn: WorkflowColumn,
        UserColumn: UserColumn,
        ApprovalRecordStatusColumn: ApprovalRecordStatusColumn,
      }}
    />
  );
};
