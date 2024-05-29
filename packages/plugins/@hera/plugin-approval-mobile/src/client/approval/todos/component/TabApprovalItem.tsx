import React, { useEffect, useState } from 'react';
import { useAPIClient, useCollectionManager, useCompile } from '@tachybase/client';
import { ExecutionStatusOptionsMap } from '@tachybase/plugin-workflow/client';
import { observer } from '@tachybase/schema';

import { useAsyncEffect } from 'ahooks';
import { Empty, List, Space, Tag } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { APPROVAL_STATUS, ApprovalPriorityType, approvalStatusOptions, ExecutionStatusOptions } from '../../constants';
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
    const { data: user } = await api.request({ url: 'users:list', params: { pageSize: 999, appends: ['roles'] } });
    if (collectionName === 'approvalRecords') {
      changeApprovalRecordsService(api, params?.[tabKey], filter, user, cm, compile, t, setData, input);
    } else if (collectionName === 'users_jobs') {
      changeUsersJobsService(api, t, cm, compile, input, setData, params?.[tabKey], filter);
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
                  let url;
                  if (collectionName === 'approvalRecords') {
                    url = `/mobile/approval/${item.id}/${item.categoryTitle}/detailspage`;
                  } else if (collectionName === 'users_jobs') {
                    url = `/mobile/approval/${item.id}/userJobspage`;
                  }
                  navigate(url);
                }}
              >
                {/* <Badge color="#6ac3ff" content={Badge.dot} style={{ '--right': '100%' }}> */}
                <Space block>
                  {item.title}
                  <Tag color={item.statusColor} fill="outline">
                    {item.statusIcon}
                    {item.statusTitle}
                  </Tag>
                  <Tag color={item.priorityColor} fill="outline">
                    {item.priorityTitle}
                  </Tag>
                </Space>
                {/* </Badge> */}
                {item.reason.map((reasonItem, index) => {
                  return <Space block key={index}>{`${reasonItem.label}:${reasonItem.value}`}</Space>;
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
    [APPROVAL_STATUS.ASSIGNED, APPROVAL_STATUS.PENDING].includes(status)
  ) {
    return { label: t('Unprocessed'), color: 'default' };
  } else {
    return approvalStatusOptions.find((value) => value.value === status);
  }
};

const changeApprovalRecordsService = (api, params, filter, user, cm, compile, t, setData, input) => {
  api
    .request({
      url: 'approvalRecords:listCentralized',
      params: {
        pageSize: 9999,
        appends: ['execution', 'job', 'node', 'workflow'],
        filter: { ...params, ...filter },
      },
    })
    .then((res) => {
      const result = res.data?.data.map((item) => {
        const itemUser = user.data.find((value) => value.id === item.userId);
        const priorityType = ApprovalPriorityType.find((priorityItem) => priorityItem.value === item.snapshot.priority);
        const statusType = approvalTodoListStatus(item, t);
        const categoryTitle = item.workflow.title.replace('审批流:', '');
        const collectionName = item.workflow?.config?.collection || item.execution?.context?.collectionName;
        const summary = Object.entries(item.summary).map(([key, value]) => {
          const field = cm.getCollectionField(`${collectionName}.${key}`);
          return {
            label: compile(field?.uiSchema?.title || key),
            value: (Object.prototype.toString.call(value) === '[object Object]' ? value?.['name'] : value) || '',
          };
        });
        return {
          ...item,
          title: `${itemUser.nickname}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType.label),
          statusColor: statusType.color,
          reason: summary,
          priorityTitle: priorityType.label,
          priorityColor: priorityType.color,
        };
      });
      const filterResult = result.filter((value) => value.title.includes(input));
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
        pageSize: 9999,
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
        const categoryTitle = item.workflow.title.replace('审批流:', '');
        const collectionName = item.workflow?.config?.collection || item.execution?.context?.collectionName;
        const summary = Object.entries(item.execution?.context?.summary).map(([key, value]) => {
          const field = cm.getCollectionField(`${collectionName}.${key}`);
          return {
            label: compile(field?.uiSchema?.title || key),
            value: (Object.prototype.toString.call(value) === '[object Object]' ? value?.['name'] : value) || '',
          };
        });
        return {
          ...item,
          title: `${item.user?.nickname}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType.label),
          statusColor: statusType.color,
          statusIcon: statusType.icon,
          reason: summary,
          priorityTitle: priorityType.label,
          priorityColor: priorityType.color,
        };
      });
      const filterResult = result.filter((value) => value.title.includes(input));
      filterResult.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
      setData(filterResult);
    })
    .catch(() => {
      console.error;
    });
};
