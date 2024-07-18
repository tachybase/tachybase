import _ from 'lodash';

import { EXECUTION_STATUS } from '../../../../constants';
import { APPROVAL_ACTION_STATUS, APPROVAL_STATUS } from '../../constants';
import { lang } from '../../locale';

export function getResults({ approval, currentUser }) {
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
