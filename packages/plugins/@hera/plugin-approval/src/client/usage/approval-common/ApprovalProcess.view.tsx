import React, { useMemo } from 'react';
import { createStyles, useCurrentUserContext } from '@tachybase/client';
import { EXECUTION_STATUS } from '@tachybase/plugin-workflow/client';

import { Space, Table } from 'antd';
import _ from 'lodash';

import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../../constants';
import { lang, usePluginTranslation } from '../../locale';
import { useApproval } from './ApprovalData.provider';
import { getAntdTableColumns } from './process-columns/columns';
import { ContextWithActionEnabled } from './WithActionEnabled.provider';

// 审批(发起/待办)区块-查看-审批处理
export const ApprovalProcess = (props) => {
  const { t } = usePluginTranslation();
  const approvalContext = useApproval();
  const { styles } = getStyles();
  const { data } = useCurrentUserContext();

  const results = useMemo(() => getResults({ approval: approvalContext, currentUser: data }), [approvalContext, data]);

  const columns = useMemo(() => getAntdTableColumns({ t, styles }), [t, styles]);

  return (
    <ContextWithActionEnabled.Provider value={{ actionEnabled: props.actionEnabled }}>
      <Space direction="vertical" size="middle" className={styles.layout}>
        {results.map((item) => (
          <Table key={item.id} dataSource={item.records} rowKey={'id'} pagination={false} columns={columns} />
        ))}
      </Space>
    </ContextWithActionEnabled.Provider>
  );
};

const getStyles = createStyles(({ css, token }) => ({
  layout: css`
    display: flex;
  `,
  columnDetail: css`
    .ant-description-textarea {
      margin-bottom: 0.5em;
    }
    time {
      display: block;
      color: ${token.colorTextTertiary};
    }
  `,
}));

function getResults({ approval, currentUser }) {
  const { workflow, approvalExecutions, records } = approval;

  approvalExecutions.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

  const approvalExecution = approvalExecutions.reduce(
    (newObj, curr) =>
      Object.assign(newObj, {
        [curr.id]: Object.assign(curr, {
          records: [
            {
              groupCount: 1,
              node: {
                title: lang('Apply'),
              },
              user: {
                ...approval.createdBy,
                id: approval.createdById,
              },
              status: curr.status ? APPROVAL_STATUS.SUBMITTED : approval.status,
              updatedAt: curr.createdAt,
              execution: { ...curr },
            },
          ],
        }),
      }),
    {},
  );
  records
    .sort((prevRecord, nextRecord) => {
      const prev = new Date(prevRecord.job?.createdAt);
      const next = new Date(nextRecord.job?.createdAt);
      return prev < next ? -1 : prev > next ? 1 : prevRecord.id - nextRecord.id;
    })
    .forEach((record) => {
      const approvalExecutionId = approvalExecution[record.approvalExecutionId];
      const omitApprovalExecutionId = _.omit(approvalExecutionId, ['records']);
      (record.workflow = workflow),
        (record.execution = { ...omitApprovalExecutionId }),
        approvalExecutionId.records.push(record),
        approvalExecutionId.jobs || (approvalExecutionId.jobs = {}),
        approvalExecutionId.jobs[record.jobId]
          ? (approvalExecutionId.jobs[record.jobId].first.groupCount += 1)
          : ((approvalExecutionId.jobs[record.jobId] = { first: record }),
            (record.groupCount = 1),
            (record.statusCount = { [APPROVAL_ACTION_STATUS.APPROVED]: 0, [APPROVAL_ACTION_STATUS.REJECTED]: 0 })),
        [APPROVAL_ACTION_STATUS.APPROVED, APPROVAL_ACTION_STATUS.REJECTED].includes(record.status) &&
          (approvalExecutionId.jobs[record.jobId].first.statusCount[record.status] += 1);
    }),
    approval.createdById === (currentUser == null ? void 0 : currentUser.data.id) &&
      approvalExecutions.forEach((approvalExecution) => {
        approvalExecution.status === EXECUTION_STATUS.CANCELED &&
          approvalExecution.records.length === 1 &&
          ((approvalExecution.records[0].groupCount = 2),
          approvalExecution.records.push({
            user: { nickname: approval.createdBy.nickname },
            status: APPROVAL_ACTION_STATUS.WITHDRAWN,
            updatedAt: approvalExecution.updatedAt,
          }));
      });
  const aELength = approvalExecutions.length;

  return approvalExecutions.filter(
    (approvalExecution, index) =>
      (aELength - 1 === index &&
        (!approvalExecution.status || approvalExecution.status === EXECUTION_STATUS.CANCELED)) ||
      approvalExecution.records.length > 1,
  );
}
