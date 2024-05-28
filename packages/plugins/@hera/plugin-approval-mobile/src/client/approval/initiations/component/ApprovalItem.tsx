import React, { useContext, useEffect, useState } from 'react';
import { useAPIClient, useCurrentUserContext } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { useDeepCompareEffect } from 'ahooks';
import { Badge, Empty, List, Space, Tag } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { ApprovalPriorityType, ApprovalStatusEnums } from '../../constants';
import { useTranslation } from '../../locale';
import { InitiationsBlockContext } from '../InitiationsBlock';

export const ApprovalItem = observer((props) => {
  const { filter, params, tabKey } = props as any;
  const api = useAPIClient();
  const [defaultData, setDefaultData] = useState([]);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useCurrentUserContext();
  const contextFilter = useContext(InitiationsBlockContext);
  const inputFilter = contextFilter['key'] === 'userInitiations' ? contextFilter['inputFilter'] : '';
  useDeepCompareEffect(() => {
    changService(api, setData, user, { ...params?.[tabKey], ...filter }, t, setDefaultData);
  }, [filter, params]);
  useEffect(() => {
    if (inputFilter && defaultData.length) {
      const filterData = defaultData.filter((value) => (value.title as string)?.includes(inputFilter));
      setData(filterData);
    } else {
      setData(defaultData);
    }
  }, [contextFilter]);
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
                {/* <Badge color="#6ac3ff" content={Badge.dot} style={{ '--right': '100%' }}> */}
                <Space block>
                  {item.title}
                  <Tag color={item.statusColor} fill="outline">
                    {item.statusTitle}
                  </Tag>
                  <Tag color={item.priorityColor} fill="outline">
                    {item.priorityTitle}
                  </Tag>
                </Space>
                {/* </Badge> */}
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

const changService = (api, setData, user, filter, t, setDefaultData) => {
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
      setDefaultData(result);
    })

    .catch(() => {
      console.error;
    });
};
