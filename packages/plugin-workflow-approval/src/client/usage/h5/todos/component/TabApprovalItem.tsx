import { useState } from 'react';
import { useAPIClient, useCollectionManager, useCompile } from '@tachybase/client';
import { observer } from '@tachybase/schema';
import { dayjs } from '@tachybase/utils/client';

import { useAsyncEffect } from 'ahooks';
import { Empty, List, Space, Tag } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { approvalStatusEnums } from '../../../../common/constants/approval-initiation-status-options';
import { APPROVAL_TODO_STATUS } from '../../../../common/constants/approval-todo-status';
import { approvalTodoStatusOptions } from '../../../../common/constants/approval-todo-status-options';
import { ApprovalPriorityType, ExecutionStatusOptions } from '../../constants';
import { useTranslation } from '../../locale';

export const TabApprovalItem = observer((props) => {
  const { filter, params, input, collectionName, tabKey } = props as any;
  const api = useAPIClient();
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const compile = useCompile();
  const navigate = useNavigate();
  const cm = useCollectionManager();
  useAsyncEffect(async () => {
    if (collectionName === 'approvalRecords') {
      changeApprovalRecordsService(api, params?.[tabKey], filter, cm, compile, t, setData, input);
    } else if (collectionName === 'users_jobs') {
      changeUsersJobsService(api, t, cm, compile, input, setData, params?.[tabKey], filter);
    } else if (collectionName === 'workflowNotice') {
      const user = await api.request({ url: 'users:list', params: { paginate: false } });
      changeWorkflowNoticeService(api, t, cm, compile, input, setData, params?.[tabKey], filter, user?.data?.data);
    }
  }, [filter, params, input]);
  return (
    <div style={{ marginTop: '10px', minHeight: '70vh' }}>
      {data.length ? (
        <List style={{ '--font-size': '12px' }}>
          {data.map((item, index) => {
            return (
              <List.Item
                key={index}
                onClick={() => {
                  const url = `/mobile/approval/${collectionName}/${item.id}/${item.categoryTitle}/detailspage`;
                  navigate(url);
                }}
              >
                {/* <Badge color="#6ac3ff" content={Badge.dot} style={{ '--right': '100%' }}> */}
                <Space block>
                  <Tag color="success" fill="solid">
                    {item.approvalId}
                  </Tag>
                  {item.title}
                  <Tag color="primary" fill="solid">
                    {item.node?.title}
                  </Tag>
                  {item.statusTitle ? (
                    <Tag color={item.statusColor} fill="outline">
                      {item.statusIcon}
                      {item.statusTitle}
                    </Tag>
                  ) : null}

                  <Tag color={item.priorityColor} fill="outline">
                    {item.priorityTitle}
                  </Tag>
                </Space>
                {/* </Badge> */}
                {item.reason?.map((reasonItem, index) => {
                  return (
                    <div className="approvalsSummaryStyle-item" key={index}>
                      <div className="approvalsSummaryStyle-label">{`${reasonItem.label}:`}&nbsp;&nbsp;</div>
                      <div className="approvalsSummaryStyle-value">{`${reasonItem.value}`}</div>
                    </div>
                  );
                })}
              </List.Item>
            );
          })}
        </List>
      ) : (
        <Empty description="暂无数据" />
      )}
    </div>
  );
});

const approvalTodoListStatus = (item, t) => {
  const { workflow, execution, job, status } = item;
  if (
    (!(workflow != null && workflow.enabled) || (execution != null && execution.stauts) || job?.status) &&
    [APPROVAL_TODO_STATUS.ASSIGNED, APPROVAL_TODO_STATUS.PENDING].includes(status)
  ) {
    return { label: t('Unprocessed'), color: 'default' };
  } else {
    return approvalTodoStatusOptions.find((value) => value.value === status);
  }
};

const changeApprovalRecordsService = (api, params, filter, cm, compile, t, setData, input) => {
  api
    .request({
      url: 'approvalRecords:listCentralized',
      params: {
        paginate: false,
        appends: ['approval.createdBy.nickname', 'execution', 'job', 'node', 'workflow', 'user'],
        filter: { ...params, ...filter },
      },
    })
    .then((res) => {
      const result = res.data?.data.map((item) => {
        const priorityType = ApprovalPriorityType.find((priorityItem) => priorityItem.value === item.snapshot.priority);
        const statusType = approvalTodoListStatus(item, t);
        const categoryTitle = item.workflow?.title;
        const collectionName = item.workflow?.config?.collection || item.execution?.context?.collectionName;

        const summary = [];
        Object.entries(item.summary)?.forEach(([key, value]) => {
          const field = cm.getCollectionField(`${collectionName}.${key}`);
          let resonValue = value;
          if (field.type === 'date' && value) {
            resonValue = dayjs(value as string).format('YYYY-MM-DD HH:mm:ss');
          }
          if (key === 'createdAt') {
            summary.unshift({
              label: compile(field?.uiSchema?.title || key),
              value:
                (Object.prototype.toString.call(value) === '[object Object]' ? resonValue?.['name'] : resonValue) || '',
            });
          } else {
            summary.push({
              label: compile(field?.uiSchema?.title || key),
              value:
                (Object.prototype.toString.call(value) === '[object Object]' ? resonValue?.['name'] : resonValue) || '',
            });
          }
        });

        const nickName = item.approval?.createdBy?.nickname;
        return {
          ...item,
          title: `${nickName}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType?.label),
          statusColor: statusType?.color || 'default',
          reason: summary || [],
          priorityTitle: priorityType?.label,
          priorityColor: priorityType?.color,
        };
      });
      const filterResult = result.filter((value) => {
        const reason = value?.reason.find((reasonItem) => reasonItem?.value.toString().includes(input));
        return value.title.includes(input) || reason;
      });

      filterResult.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
      setData(filterResult);
    })
    .catch(() => {
      console.error;
    });
};

const changeUsersJobsService = (api, t, cm, compile, input, setData, params, filter) => {
  api
    .request({
      url: 'users_jobs:list',
      params: {
        paginate: false,
        filter: { ...params, ...filter },
        appends: ['execution', 'job', 'node', 'user', 'workflow'],
      },
    })
    .then((res) => {
      const result = res.data?.data.map((item) => {
        const priorityType = ApprovalPriorityType.find(
          (priorityItem) => priorityItem.value === item.execution.context?.data?.priority,
        );
        const statusType = ExecutionStatusOptions.find((value) => value.value === item.status);
        const categoryTitle = item.workflow?.title;
        const nickName = item.execution?.context?.data?.createdBy?.nickname;
        return {
          ...item,
          title: `${nickName}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType?.label),
          statusColor: statusType?.color || 'default',
          statusIcon: statusType?.icon,
          reason: [],
          priorityTitle: priorityType?.label,
          priorityColor: priorityType?.color,
        };
      });
      const filterResult = result.filter((value) => {
        const reason = value?.reason.find((reasonItem) => reasonItem?.value.toString().includes(input));
        return value.title.includes(input) || reason;
      });

      filterResult.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
      setData(filterResult);
    })
    .catch(() => {
      console.error;
    });
};

export const changeWorkflowNoticeService = (api, t, cm, compile, input, setData, params, filter, user) => {
  api
    .request({
      url: 'approvalCarbonCopy:listCentralized',
      params: {
        paginate: false,
        filter: { ...params, ...filter },
        appends: [
          'createdBy.id',
          'createdBy.nickname',
          'approval.status',
          'user.id',
          'user.nickname',
          'node.id',
          'node.title',
          'job.id',
          'job.status',
          'job.result',
          'workflow.id',
          'workflow.title',
          'workflow.enabled',
          'execution.id',
          'execution.status',
        ],
      },
    })
    .then((res) => {
      const result = res.data?.data.map((item) => {
        const priorityType = ApprovalPriorityType.find(
          (priorityItem) => priorityItem.value === item.snapshot?.priority,
        );
        const categoryTitle = item.workflow?.title;
        const collectionName = item.collectionName;
        const summary = [];
        Object.entries(item.summary)?.forEach(([key, value]) => {
          const field = cm.getCollectionField(`${collectionName}.${key}`);
          let resonValue = value;
          if (field.type === 'date' && value) {
            resonValue = dayjs(value as string).format('YYYY-MM-DD HH:mm:ss');
          }
          if (key === 'createdAt') {
            summary.unshift({
              label: compile(field?.uiSchema?.title || key),
              value:
                (Object.prototype.toString.call(value) === '[object Object]' ? resonValue?.['name'] : resonValue) || '',
            });
          } else {
            summary.push({
              label: compile(field?.uiSchema?.title || key),
              value:
                (Object.prototype.toString.call(value) === '[object Object]' ? resonValue?.['name'] : resonValue) || '',
            });
          }
        });
        const statusType = approvalStatusEnums.find((value) => value.value === item.approval?.status);
        const nickName = user.find((userItem) => userItem.id === item.snapshot?.createdById)?.nickname;
        return {
          ...item,
          title: `${nickName}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType?.label),
          statusColor: statusType?.color || 'default',
          reason: summary,
          priorityTitle: priorityType?.label,
          priorityColor: priorityType?.color,
        };
      });

      const filterResult = result.filter((value) => {
        const reason = value?.reason.find((reasonItem) => reasonItem?.value.toString().includes(input));
        return value.title.includes(input) || reason;
      });

      filterResult.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
      setData(filterResult);
    })
    .catch(() => {
      console.error;
    });
};
