import { useAPIClient, useCollectionManager, useRequest } from '@tachybase/client';
import { connect, useFieldSchema } from '@tachybase/schema';
import { Badge, Empty, List, Space, Tag } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { useAsyncEffect } from 'ahooks';
import { APPROVAL_STATUS, ApprovalPriorityType, approvalStatusOptions } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { tval, useTranslation } from '../../locale';

export const TabApprovalItem = () => {
  const fieldSchema = useFieldSchema();
  const props = fieldSchema['x-component-props'];
  const cm = useCollectionManager();
  const api = useAPIClient();
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  useAsyncEffect(async () => {
    const { data: user } = await api.request({ url: 'users:list', params: { pageSize: 999, appends: ['roles'] } });
    api
      .request({
        url: 'approvalRecords:listCentralized',
        params: { pageSize: 99999, appends: ['execution', 'job', 'node', 'workflow'] },
      })
      .then((res) => {
        const result = res.data?.data.map((item) => {
          const itemUser = user.data.find((value) => value.id === item.userId);
          const priorityType = ApprovalPriorityType.find(
            (priorityItem) => priorityItem.value === item.snapshot.priority,
          );
          const statusType = approvalTodoListStatus(item, t);
          const categoryTitle = item.workflow.title.replace('审批流:', '');

          return {
            ...item,
            title: `${itemUser.nickname}的${categoryTitle}`,
            categoryTitle: categoryTitle,
            statusTitle: t(statusType.label),
            statusColor: statusType.color,
            reason: item.snapshot.reason || item.snapshot.reason_pay,
            priorityTitle: priorityType.label,
            priorityColor: priorityType.color,
          };
        });
        result.sort((a, b) => {
          return Date.parse(b.createdAt) - Date.parse(a.createdAt);
        });
        setData(result);
      })
      .catch(() => {
        console.error;
      });
  }, props);

  return (
    <div style={{ marginTop: '10px', minHeight: '70vh' }}>
      {data.length ? (
        <List style={{ '--font-size': '12px' }}>
          {data.map((item, index) => {
            return (
              <List.Item
                key={index}
                onClick={() => {
                  navigate(`/mobile/approval/${item.id}/${item.categoryTitle}/detailspage`);
                }}
              >
                <Badge color="#6ac3ff" content={Badge.dot} style={{ '--right': '100%' }}>
                  <Space block>
                    {item.title}
                    <Tag color={item.statusColor} fill="outline">
                      {item.statusTitle}
                    </Tag>
                    <Tag color={item.priorityColor} fill="outline">
                      {item.priorityTitle}
                    </Tag>
                  </Space>
                </Badge>
                <Space block> 事由:{item.reason}</Space>
              </List.Item>
            );
          })}
        </List>
      ) : (
        <Empty description="暂无数据" />
      )}
    </div>
  );
};

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
