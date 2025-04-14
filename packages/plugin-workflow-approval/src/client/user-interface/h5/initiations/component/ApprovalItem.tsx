import { useContext, useEffect, useState } from 'react';
import { useAPIClient, useCollectionManager, useCompile, useCurrentUserContext } from '@tachybase/client';
import { observer } from '@tachybase/schema';
import { dayjs } from '@tachybase/utils/client';

import { useDeepCompareEffect } from 'ahooks';
import { Empty, List, Space, Tag } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

import { approvalStatusEnums } from '../../../../common/constants/approval-initiation-status-options';
import { useTranslation } from '../../../../locale';
import { ApprovalPriorityType } from '../../constants';
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
  const cm = useCollectionManager();
  const compile = useCompile();
  useDeepCompareEffect(() => {
    changService(api, setData, user, { ...params?.[tabKey], ...filter }, t, setDefaultData, cm, compile);
  }, [filter, params]);
  useEffect(() => {
    if (inputFilter && defaultData.length) {
      const filterData = defaultData.filter((value) => {
        const reason = value?.reason.find((reasonItem) => reasonItem?.value?.toString().includes(inputFilter));
        return value.title.includes(inputFilter) || reason;
      });

      filterData.sort((a, b) => {
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      });
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
                  navigate(`/mobile/approval/${item.latestExecutionId}/page`);
                }}
              >
                {/* <Badge color="#6ac3ff" content={Badge.dot} style={{ '--right': '100%' }}> */}
                <Space block>
                  <Tag color="success" fill="solid">
                    {item.id}
                  </Tag>
                  {item.title}
                  <Tag color={item.statusColor} fill="outline">
                    {item.statusTitle}
                  </Tag>
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
  const { status } = item;
  return approvalStatusEnums.find((value) => value.value === status);
};

const changService = (api, setData, user, filter, t, setDefaultData, cm, compile) => {
  api
    .request({
      url: 'approvals:listCentralized',
      params: { paginate: false, appends: ['workflow'], filter },
    })
    .then((res) => {
      const result = res.data?.data.map((item) => {
        const priorityType = ApprovalPriorityType.find((priorityItem) => priorityItem.value === item.data.priority);
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
        return {
          ...item,
          title: `${user.data.data.nickname}的${categoryTitle}`,
          categoryTitle: categoryTitle,
          statusTitle: t(statusType?.label),
          statusColor: statusType?.color || 'default',
          reason: summary || [],
          priorityTitle: priorityType?.label,
          priorityColor: priorityType?.color,
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
