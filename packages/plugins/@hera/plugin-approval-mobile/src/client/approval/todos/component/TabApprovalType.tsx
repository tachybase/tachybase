import React, { useState } from 'react';
import { observer } from '@tachybase/schema';

import { Picker, Space } from 'antd-mobile';
import { DownOutline } from 'antd-mobile-icons';

import { approvalStatusOptions, ProcessedStatus } from '../../constants';
import { useTranslation } from '../../locale';

export const TabApprovalType = observer((props) => {
  const [visible, setVisible] = useState(false);
  const { changeFilter, filter } = props as any;
  const { t } = useTranslation();
  const columns = approvalStatusOptions
    .map((item) => {
      if (ProcessedStatus.includes(item.value)) {
        return {
          label: t(item.label),
          value: item.value,
        };
      }
    })
    .filter(Boolean);
  columns.unshift({ label: t('All'), value: 'all' });
  return (
    <>
      <Space
        onClick={() => {
          setVisible(true);
        }}
      >
        {columns.length && typeof filter['status'] === 'number'
          ? columns.find((item) => item.value === filter['status']).label
          : '审批状态'}
        <DownOutline />
      </Space>
      <Picker
        columns={[columns]}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onConfirm={(e) => {
          const changeData = { ...filter };
          if (e[0] === 'all') {
            changeData['status'] = ProcessedStatus;
          } else {
            changeData['status'] = e[0];
          }
          changeFilter(changeData);
        }}
      />
    </>
  );
});
