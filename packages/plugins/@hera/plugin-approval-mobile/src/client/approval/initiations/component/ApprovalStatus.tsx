import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';
import React, { useState } from 'react';
import { useTranslation } from '../../locale';

export const ApprovalStatus = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        申请状态
        <DownOutline />
      </Space>
      <Picker
        columns={[
          columns[0].map((value) => {
            return { ...value, label: t(value.label) };
          }),
        ]}
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
    { label: 'Draft', value: '0' },
    { label: 'Returned', value: '1' },
    { label: 'Submitted', value: '2' },
    { label: 'Processing', value: '3' },
    { label: 'Approved', value: '4' },
    { label: 'Rejected', value: '-1' },
  ],
];
