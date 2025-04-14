import { SchemaComponent } from '@tachybase/client';

import { NodeColumn } from '../../common/approval-columns/node.column';
import { UserColumn } from '../../common/approval-columns/user.column';
import { WorkflowColumn } from '../../common/approval-columns/workflow.column';
import { FuzzySearch } from '../common/FuzzySearch';
import { ApplyButton } from './apply-button/ApplyButton.component';
import { ViewCheckLink } from './CheckLink.view';
import { schemaTableInitiated as schema } from './TableInitiated.schema';

/**
 * DOC:
 * 区块初始化组件: 审批: 我的发起
 */
export const ViewTableInitiated = () => {
  return (
    <SchemaComponent
      schema={schema}
      components={{
        FuzzySearch,
        ApplyButton,
        ViewCheckLink,
        NodeColumn,
        WorkflowColumn,
        UserColumn,
      }}
    />
  );
};
