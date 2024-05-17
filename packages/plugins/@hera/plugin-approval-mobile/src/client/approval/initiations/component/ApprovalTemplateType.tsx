import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';

export const ApprovalTemplateType = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        模版类型
        <DownOutline />
      </Space>
      <Picker
        columns={columns}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
};

const columns = [
  [
    { label: '全部', value: '0' },
    { label: '入职申请', value: '1' },
    { label: '转正申请', value: '2' },
    { label: '调用申请', value: '3' },
    { label: '离职申请', value: '4' },
    { label: 'xxx申请', value: '5' },
  ],
];
