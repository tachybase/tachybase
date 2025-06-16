import { useMemo } from 'react';
import { useCurrentUserContext } from '@tachybase/client';
import { EXECUTION_STATUS } from '@tachybase/module-workflow/client';
import { dayjs } from '@tachybase/utils/client';

import { Space, Steps, Tag } from 'antd-mobile';
import _ from 'lodash';

import { APPROVAL_INITIATION_STATUS } from '../../../common/constants/approval-initiation-status';
import { approvalStatusEnums } from '../../../common/constants/approval-initiation-status-options';
import { APPROVAL_TODO_STATUS } from '../../../common/constants/approval-todo-status';
import { approvalTodoStatusOptions } from '../../../common/constants/approval-todo-status-options';
import { lang, useTranslation } from '../../../locale';
import { useContextApprovalExecution } from '../context/ApprovalExecution';
import { ContextWithActionEnabled } from '../context/WithActionEnabled';

export const ApprovalProcess = (props) => {
  const { t } = useTranslation();
  const { approval: approvalContext } = useContextApprovalExecution();
  const { data } = useCurrentUserContext();
  const { Step } = Steps;
  const results = useMemo(() => getResults({ approval: approvalContext, currentUser: data }), [approvalContext, data]);
  const stepsResult = getStepsResult(results, t);

  return (
    <ContextWithActionEnabled.Provider value={{ actionEnabled: props.actionEnabled }}>
      <Steps direction="vertical">
        {stepsResult.map((item, index) => {
          return (
            <Step
              title={item.title}
              key={index}
              description={
                <Space direction="vertical">
                  {item.description.map((deItem, indexs) => {
                    return (
                      <Space key={indexs}>
                        {deItem.userName}
                        <Tag color={deItem.status.color} fill="outline">
                          {t(deItem.status.label)}
                        </Tag>
                        {deItem.date}
                      </Space>
                    );
                  })}
                </Space>
              }
              status="finish"
            />
          );
        })}
      </Steps>
    </ContextWithActionEnabled.Provider>
  );
};

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
              status: curr.status ? APPROVAL_INITIATION_STATUS.SUBMITTED : approval.status,
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
            (record.statusCount = {
              [APPROVAL_INITIATION_STATUS.APPROVED]: 0,
              [APPROVAL_INITIATION_STATUS.REJECTED]: 0,
            })),
        [APPROVAL_INITIATION_STATUS.APPROVED, APPROVAL_INITIATION_STATUS.REJECTED].includes(record.status) &&
          (approvalExecutionId.jobs[record.jobId].first.statusCount[record.status] += 1);
    }),
    approval.createdById === (currentUser == null ? void 0 : currentUser.data.id) &&
      approvalExecutions.forEach((approvalExecution) => {
        approvalExecution.status === EXECUTION_STATUS.CANCELED &&
          approvalExecution.records.length === 1 &&
          ((approvalExecution.records[0].groupCount = 2),
          approvalExecution.records.push({
            user: { nickname: approval.createdBy.nickname },
            status: APPROVAL_TODO_STATUS.WITHDRAWN,
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

const getStepsResult = (result, t) => {
  const stepData = [];
  result.forEach((item) => {
    const stepItem = {};
    item.records.forEach((value, index) => {
      const status = {};
      if (
        (!(value.workflow != null && value.workflow.enabled) ||
          (value.execution != null && value.execution.stauts) ||
          value.job?.status) &&
        [APPROVAL_TODO_STATUS.ASSIGNED, APPROVAL_TODO_STATUS.PENDING].includes(value.status)
      ) {
        status['label'] = 'Unprocessed';
        status['color'] = 'default';
      } else {
        const approvalStatus = approvalTodoStatusOptions.find((option) => option.value === value.status);
        const approvalActionStatus = approvalStatusEnums.find((option) => option.value === value.status);
        if (value.nodeId) {
          status['label'] = approvalStatus?.label || approvalActionStatus?.label;
          status['color'] = approvalStatus?.color || approvalActionStatus?.color || 'default';
        } else {
          status['label'] = approvalActionStatus?.label || approvalStatus?.label;
          status['color'] = approvalActionStatus?.color || approvalStatus?.color || 'default';
        }
      }

      if (Object.keys(stepItem).includes(value.nodeId ? value.nodeId.toString() : '')) {
        stepItem[value.nodeId].description.push({
          userName: value.user.nickname,
          status,
          date: value.status === 0 ? '' : dayjs(value.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
        stepItem[value.nodeId || value.node?.title || t(status['label'])] = {
          title: value.node?.title || t(status['label']),
          index,
          description: [
            {
              userName: value.user.nickname,
              status,
              date: value.status === 0 ? '' : dayjs(value.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
            },
          ],
        };
      }
    });
    const sort = Object.values(stepItem).sort((a, b) => {
      return a['index'] - b['index'];
    });
    stepData.push(...sort);
  });
  return stepData.filter(Boolean);
};
