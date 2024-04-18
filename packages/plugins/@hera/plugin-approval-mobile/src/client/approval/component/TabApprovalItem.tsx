import { connect, useFieldSchema } from '@nocobase/schema';
import { Badge, Empty, List, Space, Tag } from 'antd-mobile';
import React from 'react';

export const TabApprovalItem = () => {
  const fieldSchema = useFieldSchema();
  const props = fieldSchema['x-component-props'];
  const blockData = props.approvalKey === 'duplicate' ? [] : data;

  return (
    <div style={{ marginTop: '10px' }}>
      {blockData.length ? (
        <List style={{ '--font-size': '12px' }}>
          {blockData.map((item, index) => {
            return (
              <List.Item key={index}>
                <Badge color="#6ac3ff" content={Badge.dot} style={{ '--right': '100%' }}>
                  <Space block>
                    {item.title}
                    <Tag color="primary" fill="outline">
                      审批中
                    </Tag>
                  </Space>
                </Badge>
                <Space block> xxxx:{item.context}</Space>
                <Space block> xxxx:{item.price}</Space>
                <Space block> xxxx:{item.context}</Space>
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

const data = [
  {
    title: 'xx-xxxxx的申请',
    context: 'xxxxxxxxx',
    price: 'xxxxxxx',
    type: '1',
    status: '1',
    date: '2024-01-08',
    read: false,
    applicantId: 9,
  },
  {
    title: 'xx-xxxxx的申请',
    context: 'xxxxxxxxx',
    price: 'xxxxxxx',
    type: '2',
    status: '2',
    date: '2024-01-09',
    read: true,
    applicantId: 10,
  },
  {
    title: 'xx-xxxxx的申请',
    context: 'xxxxxxxxx',
    price: 'xxxxxxx',
    type: '3',
    status: '3',
    date: '2024-01-010',
    read: false,
    applicantId: 11,
  },
];
