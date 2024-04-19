import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';

export const TabReadingType = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Space>
        阅读状态
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
    { label: '已读', value: '2' },
    { label: '未读', value: '3' },
  ],
];
