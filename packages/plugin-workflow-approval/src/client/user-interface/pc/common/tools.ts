import { EXECUTION_STATUS } from '@tachybase/module-workflow/client';

import _ from 'lodash';

import { APPROVAL_INITIATION_STATUS } from '../../../common/constants/approval-initiation-status';
import { APPROVAL_TODO_STATUS } from '../../../common/constants/approval-todo-status';
import { lang } from '../../../locale';

// TODO: 拆了这个大文件
export function getResults(params) {
  const { approval, currentUser } = params;
  const { id, workflow, approvalExecutions: originApprovalExecutions, records } = approval;

  const approvalExecutions = _.cloneDeep(originApprovalExecutions);

  approvalExecutions.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

  const approvalExecution = approvalExecutions.reduce(
    (newObj, curr) => ({
      ...newObj,
      [curr.id]: Object.assign(curr, {
        records: [
          {
            approvalId: id,
            groupCount: 1,
            node: {
              title: lang('Apply'),
            },
            user: {
              ...approval.createdBy,
              id: approval.createdById,
            },
            status: curr.status ? APPROVAL_INITIATION_STATUS.SUBMITTED : approval.status,
            updatedAt: curr.createdAt,
            execution: { ...curr },
          },
        ],
      }),
    }),
    {},
  );

  records.sort((prevRecord, nextRecord) => {
    const prev = new Date(prevRecord.job?.createdAt);
    const next = new Date(nextRecord.job?.createdAt);
    return prev < next ? -1 : prev > next ? 1 : prevRecord.id - nextRecord.id;
  });

  for (const record of records) {
    const approvalExecutionId = approvalExecution[record.approvalExecutionId];
    const omitApprovalExecutionId = _.omit(approvalExecutionId, ['records']);
    record.workflow = workflow;
    record.execution = { ...omitApprovalExecutionId };
    approvalExecutionId.records.push(record);

    if (!approvalExecutionId.jobs) {
      approvalExecutionId.jobs = {};
    }

    if (approvalExecutionId.jobs[record.jobId]) {
      approvalExecutionId.jobs[record.jobId].first.groupCount += 1;
    } else {
      (approvalExecutionId.jobs[record.jobId] = { first: record }),
        (record.groupCount = 1),
        (record.statusCount = { [APPROVAL_TODO_STATUS.APPROVED]: 0, [APPROVAL_TODO_STATUS.REJECTED]: 0 });
    }
    if ([APPROVAL_TODO_STATUS.APPROVED, APPROVAL_TODO_STATUS.REJECTED].includes(record.status)) {
      approvalExecutionId.jobs[record.jobId].first.statusCount[record.status] += 1;
    }
  }

  if (approval.createdById === currentUser?.data.id) {
    for (const approvalExecution of approvalExecutions) {
      if (approvalExecution.status === EXECUTION_STATUS.CANCELED && approvalExecution.records.length === 1) {
        (approvalExecution.records[0].groupCount = 2),
          approvalExecution.records.push({
            user: { nickname: approval.createdBy.nickname },
            status: APPROVAL_TODO_STATUS.WITHDRAWN,
            updatedAt: approvalExecution.updatedAt,
          });
      }
    }
  }

  const aELength = approvalExecutions.length;

  const resultList = approvalExecutions.filter(
    (approvalExecution, index) =>
      (aELength - 1 === index &&
        (!approvalExecution.status || approvalExecution.status === EXECUTION_STATUS.CANCELED)) ||
      approvalExecution.records.length > 1,
  );

  return resultList;
}
