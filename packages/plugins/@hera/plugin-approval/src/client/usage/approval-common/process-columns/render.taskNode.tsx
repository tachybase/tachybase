import React from 'react';
import { css, useCompile } from '@tachybase/client';

import { Progress, Tag } from 'antd';

import {
  APPROVAL_ACTION_STATUS,
  approvalStatusConfigObj,
  JobStatusEnums,
  VoteCategoryEnums,
  voteOption,
} from '../../../constants';

// 审批处理: 任务节点值
export function renderColumnTaskNode(text, { node, job, groupCount, statusCount }, group) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const compile = useCompile();
  const { branchMode, negotiation } = node?.config ? node : ({} as any);
  const enums = VoteCategoryEnums[voteOption(negotiation)];
  const tag = branchMode ? approvalStatusConfigObj[job.result] : JobStatusEnums[job?.status];
  // return null;
  return (
    <>
      <span key={'span'}>{text}</span>
      {group && groupCount > 1 ? (
        <div
          className={css`
            display: flex;
            align-items: center;
            gap: 0.5em;

            .ant-tag {
              margin-right: 0;
            }
          `}
        >
          <Tag key={'tag'} color={tag == null ? void 0 : tag.color}>
            {typeof enums.label == 'function' ? enums.label(negotiation) : compile(enums.label)}
          </Tag>
          {statusCount ? (
            <Progress
              type="circle"
              size={20}
              strokeColor="#389e0d"
              showInfo={false}
              percent={
                ((statusCount[APPROVAL_ACTION_STATUS.APPROVED] + statusCount[APPROVAL_ACTION_STATUS.REJECTED]) /
                  groupCount) *
                100
              }
              success={{
                percent: (statusCount[APPROVAL_ACTION_STATUS.REJECTED] / groupCount) * 100,
                strokeColor: '#cf1322',
              }}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}
