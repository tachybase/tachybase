import React from 'react';
import { useCompile } from '@tachybase/client';
import { Branch, NodeDefaultView, useFlowContext, useStyles } from '@tachybase/module-workflow/client';

import { Tag } from 'antd';

import { APPROVAL_TODO_STATUS } from '../../common/constants/approval-todo-status';
import { approvalStatusConfigObj } from '../../pc/constants';

// 审批节点组件
export const ApprovalInstructionNode = ({ data }) => {
  const { styles } = useStyles();
  const { config } = data;
  return (
    <NodeDefaultView data={data}>
      {config.branchMode ? (
        <div className={styles.nodeSubtreeClass}>
          <div className={styles.branchBlockClass}>
            <BranchListComp data={data} />
          </div>
        </div>
      ) : null}
    </NodeDefaultView>
  );
};

// Child Component; 审批节点分支
const BranchListComp = (props) => {
  const { data } = props;
  const compile = useCompile();
  const { nodes } = useFlowContext();

  const { id, config } = data;
  const isAllowReturned = config?.actions?.includes(APPROVAL_TODO_STATUS.RETURNED);
  const baseStatusArr = [APPROVAL_TODO_STATUS.REJECTED, APPROVAL_TODO_STATUS.APPROVED];
  const statusArr = isAllowReturned ? [...baseStatusArr, APPROVAL_TODO_STATUS.RETURNED] : baseStatusArr;

  const isEntry = (targetStatus) => nodes.find((node) => node.upstreamId === id && node.branchIndex === targetStatus);
  const isEnd = (targetStatus) =>
    targetStatus === APPROVAL_TODO_STATUS.RETURNED ||
    (targetStatus === APPROVAL_TODO_STATUS.REJECTED && config.endOnReject);

  return statusArr.map((targetStatus) => (
    <Branch
      key={targetStatus}
      branchIndex={targetStatus}
      from={data}
      entry={isEntry(targetStatus)}
      end={isEnd(targetStatus)}
      controller={
        <Tag
          color={approvalStatusConfigObj[targetStatus].color}
          style={{
            position: 'relative',
            margin: '1rem 0 0 0',
          }}
        >
          {compile(approvalStatusConfigObj[targetStatus].label)}
        </Tag>
      }
    />
  ));
};
