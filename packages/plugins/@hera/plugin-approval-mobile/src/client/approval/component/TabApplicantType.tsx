import { useFieldSchema } from '@nocobase/schema';
import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';

export const TabApplicantType = () => {
  const [visible, setVisible] = useState(false);
  return (
    <Space>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        申请人
        <DownOutline />
      </Space>
      <Picker
        columns={columns}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </Space>
  );
};

const columns = [
  [
    { label: '111', value: '1' },
    { label: '222', value: '2' },
    { label: '333', value: '3' },
    { label: '444', value: '4' },
  ],
];
