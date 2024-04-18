import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';

export const TabApprovalType = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        审批状态
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
    { label: '审批中', value: '1' },
    { label: '已通过', value: '2' },
    { label: '已驳回', value: '3' },
    { label: '已撤销', value: '4' },
  ],
];
