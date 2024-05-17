import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';

export const ApprovalReachDataType = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Space>
        到达日期
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
    { label: '全部', value: '1' },
    { label: '近7日', value: '2' },
    { label: '近30日', value: '3' },
    { label: '自定义区间', value: '4' },
  ],
];
