import { useAPIClient, useCurrentUserContext } from '@tachybase/client';
import { Badge, Empty, List, Space, Tag } from 'antd-mobile';
import React, { useState } from 'react';
import { useDeepCompareEffect } from 'ahooks';
import { ApprovalPriorityType, ApprovalStatusEnums } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../locale';
import { observer } from '@tachybase/schema';

export const ApprovalItem = observer((props) => {
  const { filter, params } = props as any;
  const api = useAPIClient();
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useCurrentUserContext();
  useDeepCompareEffect(() => {
    changService(api, setData, user, { ...params?.filter, ...filter }, t);
  }, [filter, params]);

  return (
    <div style={{ minHeight: '73vh' }}>
      {data.length ? (
        <List style={{ '--font-size': '12px' }}>
          {data.map((item, index) => {
            return (
              <List.Item
                key={index}
                onClick={() => {
                  navigate(`/mobile/approval/${item.id}/page`);
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
});

const approvalTodoListStatus = (item, t) => {
  const { status } = item;
  return ApprovalStatusEnums.find((value) => value.value === status);
};

const changService = (api, setData, user, filter, t) => {
  console.log('🚀 ~ changService ~ filter:', filter);
  api
    .request({
      url: 'approvals:listCentralized',
      params: { pageSize: 99999, appends: ['workflow'], filter },
    })
    .then((res) => {
      const result = res.data?.data.map((item) => {
        const priorityType = ApprovalPriorityType.find((priorityItem) => priorityItem.value === item.data.priority);
        const statusType = approvalTodoListStatus(item, t);
        const categoryTitle = item.workflow.title.replace('审批流:', '');
        return {
          ...item,
          title: `${user.data.data.nickname}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType.label),
          statusColor: statusType.color,
          reason: item.data.reason || item.data.reason_pay,
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
};
